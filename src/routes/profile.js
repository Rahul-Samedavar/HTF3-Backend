import express from "express";

import { authenticate } from "../middlewares/auth.js";
import { getUserByID } from "../database/users.js";

const router = express.Router()


router.get(
    "/data",
    authenticate,
    async (req, res) => {
        try {
            const data = await getUserByID(req.auth.userID)
            delete data.password_hash
            if (data) 
                res.status(200).json({success: true, profile: data})
            else
                res.status(404).json({success: false, message: "User Not Found"})
        }
        catch(err){
            console.error("login failed", err);
            return res.status(500).json({ success: false,  error: "Login failed"});
        }
            
    }
);





export default router;