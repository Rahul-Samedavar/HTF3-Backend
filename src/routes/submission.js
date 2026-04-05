import express from "express";


import { authenticate } from "../middlewares/auth.js";
import { addSubmission, getSubmissions, updateSubmission } from "../database/submissions.js";
import { getTeamOf } from "../database/teams.js";
import { sublimitter } from "../middlewares/ratelimiter.js";

const router = express.Router();

router.post("/add", authenticate, sublimitter, async (req, res) => {

  try {
    const {track_id, ps_id, ppt_drive_link, demo_link, title, description} = req.body

    if (!track_id || !ps_id || !ppt_drive_link || !demo_link || !title || !description)
        return res.status(400).json({error: "Missing Feilds"})
    
    const teamResp = await getTeamOf(req.auth.userID)

    if (!teamResp)
        return res.status(400).json({error: "User not in any Team"})

    const subResp = await addSubmission(teamResp.id, track_id, ps_id, ppt_drive_link, demo_link, title, description)

    return res.status(subResp.success ? 200 : 400).json(subResp)

  } catch (err) {
    console.error("Failed to add Submission", err)
    res.status(500).json({ success: false, error: "Internal Srver Error" });
  } 
});


router.get("/data", authenticate, async (req, res) => {

  try {
    const teamResp = await getTeamOf(req.auth.userID)

    if (!teamResp)
        return res.status(400).json({error: "User not in any Team"})

    const subResp = await getSubmissions(teamResp.id)
    return res.status(subResp.success ? 200 : 400).json(subResp)

  } catch (err) {
    console.error("Failed to get Submission", err)
    res.status(500).json({ success: false, error: "Internal Srver Error" });
  } 
});

router.post("/update", authenticate, sublimitter, async (req, res) => {

  try {
    const {ppt_drive_link, demo_link, title, description} = req.body

    const teamResp = await getTeamOf(req.auth.userID)

    if (!teamResp)
        return res.status(400).json({error: "User not in any Team"})

    const subResp = await updateSubmission(teamResp.id, {ppt_drive_link, demo_link, idea_title: title, description})

    return res.status(subResp.success ? 200 : 400).json(subResp)

  } catch (err) {
    console.error("Failed to update Submission", err)
    res.status(500).json({ success: false, error: "Internal Srver Error" });
  } 
});





export default router;
