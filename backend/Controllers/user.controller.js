const jwt = require("jsonwebtoken") 
const bcrypt = require("bcryptjs");
const User = require("../Models/user.model")
const Note = require("../Models/note.model")


const signIn = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) return res.status(400).json({ message: "Email required" });
    if (!password) return res.status(400).json({ message: "Password required" });

    try {
        console.log("Finding user by email...");
        // Find the user by email
        const userInfo = await User.findOne({ email });

        if (!userInfo) {
            console.log("User not found!");
            return res.status(400).json({ message: "User not found!" });
        }

        console.log("User found. Comparing password...");
        // Compare provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, userInfo.password);

        console.log("Password comparison result:", isPasswordValid, "Provided password:", password, "Stored hashed password:", userInfo.password);

        // If password is invalid, send an error response
        if (!isPasswordValid) {
            console.log("Invalid credentials!");
            return res.status(400).json({ error: true, message: "Invalid credentials" });
        }

        console.log("Password valid. Creating JWT token...");
        // Create JWT token
        const payload = { userId: userInfo._id, email: userInfo.email };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

        // Send success response with the token
        return res.json({
            error: false,
            message: "Login Successful!",
            email,
            accessToken,
        });
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};



const signUp = async (req, res) => {
    const { fullName, email, password } = req.body;

    // Validate the required fields
    if (!fullName) return res.status(400).json({ error: true, message: "Full name is required" });
    if (!email) return res.status(400).json({ error: true, message: "Email is required" });
    if (!password) return res.status(400).json({ error: true, message: "Password is required" });

    try {
        // Check if user already exists
        const isUser = await User.findOne({ email });
        if (isUser) return res.status(400).json({ error: true, message: "User already exists" });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({ fullName, email, password: hashedPassword });
        await user.save();

        // Create JWT token
        const payload = { userId: user._id, email: user.email };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

        // Send success response with the token
        return res.status(200).json({
            error: false, user, accessToken, message: "Registration completed",
        });
    } catch (error) {
        console.error("Error during account creation:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const addNote = async (req, res) => {
    console.log("Reached addNote backend");
    const { title, content, tags, isPinned } = req.body;
    const { userId } = req.user;

    if (!title) {
        console.log("Title is required");
        return res.status(400).json({ message: "Title required!" });
    }

    try {
        console.log("Creating new note...");
        const note = new Note({
            title,
            content,
            tags: tags || [],
            isPinned: isPinned || false,
            userId,
        });

        await note.save();
        console.log("Note saved successfully");

        return res.json({
            error: false,
            note,
            message: "Note added successfully"
        });
    } catch (error) {
        console.error("Error saving note:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};

const editNote = async (req, res) => {
    console.log("Reached backend edit");

    if (!req.user) {
        console.log("User is not authenticated");
        return res.status(401).json({ message: "User not authenticated" });
    }

    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const userId = req.user._id.toString(); 

    if (!userId) {
        console.log("User ID is missing");
        return res.status(400).json({ message: "Invalid user" });
    }

    if (!title && !content && !tags) {
        console.log("No changes were made");
        return res.status(400).json({ message: "No changes were made" });
    }

    try {
        console.log("Searching for note");
        const note = await Note.findOne({ _id: noteId, userId: userId });

        if (!note) {
            console.log("Note not found");
            return res.status(404).json({ message: "Note not found" });
        } else {
            console.log("Note found");
        }

        if (title) {
            note.title = title;
            console.log("Title updated");
        }
        if (content) {
            note.content = content;
            console.log("Content updated");
        }
        if (tags) {
            note.tags = tags;
            console.log("Tags updated");
        }
        if (isPinned !== undefined) {
            note.isPinned = isPinned;
            console.log("IsPinned updated");
        }

        await note.save();
        console.log("Note saved successfully");

        return res.status(200).json({
            error: false,
            note,
            message: "Note updated successfully"
        });
    } catch (error) {
        console.error("Error updating note:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};





module.exports = {signUp, signIn, addNote, editNote}