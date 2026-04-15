import express from "express";

import { authenticate } from "../middlewares/auth.js";
import { createTeam, getTeamDetails, getTeamOf, joinTeam, removeFromTeam } from "../database/teams.js";
import { parseTeamCode } from "../utils/coder.js";

const router = express.Router()

router.post(
    "/create",
    authenticate,
    async (req, res) => {
        try {
            let teamName = req.body?.teamName
            if (!teamName) return res.status(400).json({error: "Team name missing"}) 
            teamName = teamName.trim()
            if (teamName.length < 5) return res.status(400).json({error: "Team name too short"}) 
            
            const teamResp = await createTeam(req.auth.userID, teamName)
            if(teamResp.success)
                return res.status(200).json({teamID: teamResp.teamID})
            return res.status(400).json(teamResp)
        }
        catch(err){
            console.error("Failed to Create Team", err);
            return res.status(500).json({ success: false,  error: "Internal Server Error"});
        }
            
    }
);

router.post(
    "/join",
    authenticate,
    async (req, res) => {
        try {
            const {teamCode} = req.body
            if (!teamCode) return res.status(400).json({error: "Team Code missing"}) 

            const teamID = parseTeamCode(teamCode)
            console.log(teamID)
            
            const teamResp = await joinTeam(req.auth.userID, teamID)

            if(teamResp.success)
                return res.status(200).json({teamID: teamResp.teamID})
            return res.status(400).json(teamResp)
        }
        catch(err){
            console.error("Failed to Join Team", err);
            return res.status(500).json({ success: false,  error: "Internal Server Error"});
        }
            
    }
);


router.post(
    "/remove",
    authenticate, 
    async (req, res) => {

        try {

            if (res.body) return res.status(400).json({error: "user ID missing"}) 

            const {targetID}  = res.body;
            if (!targetID) return res.status(400).json({error: "user ID missing"}) 

            const teamResp = await removeFromTeam(targetID, req.auth.userID)
        
            if (teamResp.success)
                return res.status(200)
            else
                return res.status(400).json(teamResp)
        }
        catch(err){
            console.error("Failed to remove from Team", err);
            return res.status(500).json({ success: false,  error: "Internal Server Error"});
        }
        
    }
)


router.get(
    "/details",
    authenticate,
    async (req, res) => {
        try {
            const team = await getTeamOf(req.auth.userID)
            if (team) res.status(200).json(team)
            else res.status(404).json({error: "Not in any Team"})
        } catch (err) {
            console.error("Failed to fetch Team", err);
            return res.status(500).json({ success: false,  error: "Internal Server Error"});
        }
    }
)


router.get(
    "/:teamCode",
    authenticate,
    async (req, res) => {
        try {
            const teamCode = req.params?.teamCode
            if(!teamCode) res.status(404).json({error: "Team Code Missing"})
            const teamID = parseTeamCode(teamCode.trim())
            const team = await getTeamDetails(teamID)
            if (team) res.status(200).json(team)
            else res.status(404).json({error: "Not a valid team Code"})
        } catch (err) {
            console.error("Failed to fetch Team", err);
            return res.status(500).json({ success: false,  error: "Internal Server Error"});
        }
    }
)


export default router;