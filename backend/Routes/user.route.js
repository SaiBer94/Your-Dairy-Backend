const express = require("express");
const router = express.Router();
const {signUp, signIn, addNote, editNote, getAllNotes, deleteNote, togglePinned, getUser} = require("../Controllers/user.controller");
const { authToken } = require("../Utils/utilities");


router.get("/getUser", authToken, getUser)
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/addNote", authToken,addNote);
router.patch("/editNote/:noteId", authToken,editNote);
router.get("/getAllNotes", authToken, getAllNotes);
router.delete("/deleteNote/:noteId", authToken, deleteNote)
router.patch("/togglePinned/:noteId", authToken, togglePinned);


module.exports = router;