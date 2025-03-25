const mongoose = require("mongoose");
require("./user"); 

const { Schema } = mongoose;

// Create Schema
const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: { // ✅ Change from String to Number
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    contact: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User", // ✅ Ensure it matches the model name
        required: true,
    }
});

// Create Model
const Items = mongoose.model("Item", itemSchema); // ✅ Use singular "Item" for consistency

module.exports = Items;
