import express from "express";
import bcrypt from "bcrypt";

import { createUser } from "../database/users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    let idx = createUser(email, password, username)

    if (idx == -1){
      res.status(409).json({ succes: false,  message: "Email ID taken" });
    }

    return res.status(200).json({succes: true, message: "Registration Success"});

  } catch (err) {
    console.error(err);
    res.status(500).json({ succes: false,  error: "Registration failed" });
  }
});

export default router;