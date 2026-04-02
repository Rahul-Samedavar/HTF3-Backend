import express from "express";


import { createUser, getUserByEmail, resetPassword, verifyPassword} from "../database/users.js";
import { signToken,prepareAuthPayload } from "../utils/jwt.js";

const router = express.Router();


// TODO: Yet to add otp

router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: "Weak password" });
    }

    let idx = await createUser(email, password, username)

    if (idx == -1){
      return res.status(409).json({ success: false,  error: "Email ID taken" });
    }

    const token = signToken(prepareAuthPayload(idx,  email, username ))

    return res.status(200).json({success: true, token: token});

  } catch (err) {
    console.error("signup failed", err);
    return res.status(500).json({ success: false,  error: "Internal Server Error" });
  }
});


router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) 
      return res.status(400).json({ success: false, error: "Missing fields" });

    let user = await getUserByEmail(email)

    if (!user || ! (await verifyPassword(password, user.password_hash))) 
       return res.status(401).json({success: false, error: "Invalid Credentials"})

    const token = signToken(prepareAuthPayload(user.id,  email, user.username))

    return res.status(200).json({success: true, message: "Login Success", token: token});

  } catch (err) {
    console.error("login failed", err);
    return res.status(500).json({ success: false,  error: "Login failed"});
  }
});


// TODO: Yet to add otp
// router.post("/reset-password", async (req, res) => {
//   try{
//     const {email, password} = req.body;

//     if (!email || !password) 
//       return res.status(400).json({ success: false, error: "Missing fields" });

//     if (await resetPassword(email, password)){
//       return res.status(200).json({success: true})
//     }

//     return res.status(404).json({success: false, error: "User Not Found"})

//   } catch(err){
//     console.error("password reset failed: ", err);
//     return res.status(500).json({ success: false,  error: "failed"});
//   }
// });

export default router;