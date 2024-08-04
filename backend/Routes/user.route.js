const express = require("express");
const router = express.Router();
const {signUp, signIn, addNote, editNote} = require("../Controllers/user.controller");
const { authToken } = require("../Utils/utilities");

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/addNote", authToken,addNote);
router.patch("/editNote/:noteId", authToken,editNote);

module.exports = router;