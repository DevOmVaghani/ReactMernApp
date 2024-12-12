

const express = require("express");
const Test = require("../login/model");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await Test.create({ name, email });
    res.status(200).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error("Error saving Test record:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

module.exports = router;

