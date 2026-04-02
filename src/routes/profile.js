import express from "express";

import { authenticate } from "../middlewares/auth.js";
import { getUserByID } from "../database/users.js";
import { updateDetails } from "../database/users.js";

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
            console.error("profile fetch failed", err);
            return res.status(500).json({ success: false,  error: "Internal Server Error"});
        }
            
    }
);


router.post(
    "/update",
    authenticate,
    async (req, res) => {
        try {
            const userID = req.auth.userID;

            const {
                phone, gender, location, bio,
                college, department, year
            } = req.body;

            const updatedUser = await updateDetails(
                userID, phone, gender, location,
                bio,college,department, year
            );

            delete updatedUser.password_hash;

            return res.status(200).json({
                success: true,
                profile: updatedUser
            });

        } catch (err) {
            console.error("profile update failed", err);

            if (err.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(500).json({
                success: false,
                error: "Update failed"
            });
        }
    }
);



export default router;


