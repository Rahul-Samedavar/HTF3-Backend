import express from "express";
import { getAdminByName,getAllData,verifyPassword } from "../database/admin.js";
import { prepareAdminAuthPayload,signToken } from "../utils/jwt.js";
import { adminAuthLimiter,sublimitteradmin } from "../middlewares/ratelimiter.js";
import { authenticateAdmin } from "../middlewares/adminAuth.js";


const router = express.Router();

router.post("/signin", adminAuthLimiter, async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ success: false, error: "Missing fields" })
    const { username, password } = req.body;

    if (!username || !password) 
      return res.status(400).json({ success: false, error: "Missing fields" });

    let admin = await getAdminByName(username)

    console.log("Admin", admin)

    if (!admin || ! (await verifyPassword(password.trim(), admin.password_hash))) 
       return res.status(401).json({success: false, error: "Invalid Credentials"})

    const token = signToken(prepareAdminAuthPayload(admin.id, admin.username), '6h')

    return res.status(200).json({success: true, message: "Login Success", token: token});

  } catch (err) {
    console.error("login failed", err);
    return res.status(500).json({ success: false,  error: "Login failed"});
  }
});


router.get("/get-all-data",  authenticateAdmin, sublimitteradmin, async(req, res)=> {
  const data = await getAllData();
  return res.json({data})
})

export default router;

