const express = require("express");
const router = express.Router();
const {createAccount} = require("../Controllers/user.controller")

//Create account
router.post("/create-account", createAccount);

module.exports = router;