import express from "express";


import { createUser, deleteUser, getUserByEmail, resetPassword, verifyPassword} from "../database/users.js";
import { signToken,prepareAuthPayload } from "../utils/jwt.js";
import { generateOTP } from "../utils/otp.js";
import { hashOTP } from "../utils/otp.js";
import { sendOTP, sendOTPForResetPassoword } from "../services/mailing.js";
import { checkForPrevOTP, checkOTP, saveOTP } from "../database/otp.js";
import { authLimiter } from "../middlewares/ratelimiter.js";

const router = express.Router();

router.post("/signup/init", authLimiter, async (req, res) => {

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email required" });
    }

    if (await getUserByEmail(email))
      return res.status(400).json({ success: false, error: "Email Taken" });

    if (await checkForPrevOTP(email))
      return res.status(200).json({ success: true, error: "OTP already sent. Please check your email" });

    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    
    if (! await saveOTP(email, otpHash, 5))
      return res.status(500).json({error: "Internal Server Error"})
    const sendResp = await sendOTP(email, otp);
    if (!sendResp?.success) return res.status(500).json({error: "Couldn't send OTP. please try again later"})

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("Failed to send OTP.", err)
    res.status(500).json({ success: false, error: "Internal Srver Error" });
  } 
});

router.post("/signup", authLimiter, async (req, res) => {
  try {
    const { email, password, username, otp } = req.body;

    if (!email || !password || !username || !otp) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: "Weak password" });
    }

    const otpRes = await checkOTP(email, otp);
    if (!otpRes.success)
      return res.status(400).json(otpRes);

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


router.post("/signin", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) 
      return res.status(400).json({ success: false, error: "Missing fields" });

    let user = await getUserByEmail(email)

    if (!user || ! (await verifyPassword(password.trim(), user.password_hash))) 
       return res.status(401).json({success: false, error: "Invalid Credentials"})

    const token = signToken(prepareAuthPayload(user.id,  email, user.username))

    return res.status(200).json({success: true, message: "Login Success", token: token});

  } catch (err) {
    console.error("login failed", err);
    return res.status(500).json({ success: false,  error: "Login failed"});
  }
});

router.post("/reset-password/init", authLimiter, async (req, res) => {
  try{
    const {email} = req.body;

    if (!email) 
      return res.status(400).json({ success: false, error: "Missing fields" });


    if (! (await getUserByEmail(email)))
      return res.status(404).json({ success: false, error: "No account exists with this email!!" });


    if (await checkForPrevOTP(email))
      return res.status(200).json({ success: true, error: "OTP already sent. Please check your email" });


    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    
    if (! await saveOTP(email, otpHash, 10))
      return res.status(500).json({error: "Internal Server Error"})
    const sendResp = await sendOTPForResetPassoword(email, otp);

    if (!sendResp?.success) return res.status(500).json({error: "Couldn't send OTP. please try again later"})

    return res.status(200).json({msg: "OTP sent"})


  } catch(err){
    console.error("password reset-init failed: ", err);
    return res.status(500).json({ success: false,  error: "failed"});
  }
});


router.post("/reset-password", authLimiter, async (req, res) => {
  try{
    let {email, password, otp} = req.body;

    if (!email || !password || !otp) 
      return res.status(400).json({ success: false, error: "Missing fields" });


    if (! (await getUserByEmail(email)))
      return res.status(404).json({ success: false, error: "No account exists with this email!!" });


    password = password.trim()
    
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: "Weak password" });
    }

    const otpRes = await checkOTP(email, otp);
    if (!otpRes.success)
      return res.status(400).json(otpRes);

    if (await resetPassword(email, password)){
      return res.status(200).json({success: true})
    }

    return res.status(404).json({success: false, error: "User Not Found"})

  } catch(err){
    console.error("password reset failed: ", err);
    return res.status(500).json({ success: false,  error: "failed"});
  }
});


router.post("/delete", async(req, res) => {
  try{
  const delres = await deleteUser(req.body?.email);
  return res.status(delres.success ? 200: 400).json(delres)
  }catch(err){
    console.error("password reset failed: ", err);
    return res.status(500).json({ success: false,  error: "failed"});
  }
})



export default router;

