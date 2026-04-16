import express from "express";
import { getAdminByName } from "../database/admin";
import { prepareAdminAuthPayload,verifyPassword } from "../utils/jwt";
import { signToken } from "../utils/jwt";
import router from "./teams";

const router = express.Router();

router.post("/signin", authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) 
      return res.status(400).json({ success: false, error: "Missing fields" });

    let admin = await getAdminByName(username)

    if (!admin || ! (await verifyPassword(password.trim(), user.password_hash))) 
       return res.status(401).json({success: false, error: "Invalid Credentials"})

    const token = signToken(prepareAdminAuthPayload(id, user.username), '6h')

    return res.status(200).json({success: true, message: "Login Success", token: token});

  } catch (err) {
    console.error("login failed", err);
    return res.status(500).json({ success: false,  error: "Login failed"});
  }
});


export default router;

