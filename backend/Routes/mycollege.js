const express = require("express");
const router = express.Router();
const Items = require("../Models/items");
const multer = require("multer");

const User=require("../Models/user");
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // Limit 5MB

router.get("/", async (req, res) => {
    try {
        const items = await Items.find(); 
        res.json(items); 
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});
router.post("/", upload.single("image"), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const { name, price, description, contact } = req.body;
      const owner = req.user._id; // Get user ID from session
  
      // Validate image upload
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }
  
      // Simulate storing the image (in a real case, use Cloudinary/S3)
      const imageUrl = `data:image/png;base64,${req.file.buffer.toString("base64")}`;
  
      // Create new item
      const newItem = new Items({
        name,
        price,
        description,
        contact,
        image: { url: imageUrl, filename: req.file.originalname },
        owner,
      });
  
      await newItem.save();
      res.status(201).json({ message: "Item added successfully", item: newItem });
    } catch (error) {
      console.error("Error adding item:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
//   router.get("/:id", async (req, res) => {
//     try {
//         const item = await Items.findById(req.params.id);
//         if (!item) return res.status(404).json({ message: "Item not found" });

//         const isOwner = req.user && item.owner.toString() === req.user._id.toString(); // Check ownership
//         res.json({ item, isOwner });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     } 
// });
router.get("/:id", async (req, res) => {
  try {
      const item = await Items.findById(req.params.id).populate("owner", "name");

      if (!item) return res.status(404).json({ message: "Item not found" });

      const isOwner = req.user && item.owner?._id.toString() === req.user._id.toString();
      res.json({ 
          item, 
          isOwner, 
          ownerName: item.owner?.name || "Unknown"  // Fix if owner is missing
      });
  } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
      const item = await Items.findById(req.params.id);
      if (!item) return res.status(404).json({ message: "Item not found" });

      if (!req.user || item.owner.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: "Unauthorized" });
      }

      await item.deleteOne();
      res.json({ message: "Item deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
      const { name, price, description, contact } = req.body;

      const updatedItem = await Items.findByIdAndUpdate(
          req.params.id,
          { name, price, description, contact },
          { new: true } // Ensures we get the updated item
      ).populate("owner", "name"); // Ensure owner name is populated

      if (!updatedItem) return res.status(404).json({ message: "Item not found" });

      res.json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
  }
});

  
  module.exports = router;


