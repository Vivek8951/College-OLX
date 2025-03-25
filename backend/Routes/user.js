const express = require("express");
const passport = require("passport");
const User = require("../Models/user"); 

const router = express.Router();
// Signup route
router.post("/signup", async (req, res, next) => {
    try {
        let { username, email, name, password } = req.body;
        const newUser = new User({ email, username, name });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            res.status(201).json({ message: "Signup successful", user: registeredUser });
        });
    } catch (e) {
        console.error(e.message);
        res.status(400).json({ error: e.message });
    }
});

// Login route
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        req.login(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({ message: "Logged in successfully", user });
        });
    })(req, res, next);
});

// Check authentication status
router.get("/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

// Logout route
router.get("/auth/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie("connect.sid"); 
            return res.json({ message: "Logged out successfully" });
        });
    });
});

module.exports = router;