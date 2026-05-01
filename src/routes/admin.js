import express from "express";
import { getAdminByID, getAdminByName,getAllData,verifyPassword } from "../database/admin.js";
import { prepareAdminAuthPayload,signToken } from "../utils/jwt.js";
import { adminAuthLimiter,sublimitteradmin } from "../middlewares/ratelimiter.js";
import { authenticateAdmin } from "../middlewares/adminAuth.js";
import { deleteUser } from "../database/users.js";
import { deleteTeam } from "../database/teams.js";
import { deleteSubmission, updateCollege } from "../database/submissions.js";

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


// for backing up data
router.get("/get-all-data",  authenticateAdmin, sublimitteradmin, async(req, res)=> {
  const data = await getAllData();
  return res.json({data})
});


router.post("/delete-users", authenticateAdmin, async (req, res)=> {
  try {
    const admin = await getAdminByID(req.auth.adminId);

    if (admin?.role != "super-admin")
        return res.status(401).json({error: "Unauthorized"});

    const target_email = req.body?.email;
    if (!target_email) return req.status(400).json({error: "Missing Feilds"});

    const delres = await deleteUser(target_email);
    return res.status(delres.success ? 200: 400).json(delres)

  }
  catch (err) {
    console.error("delete user failed", err);
    return res.status(500).json({ success: false,  error: "Delete Failed"});
  }
});


router.post("/delete-team", authenticateAdmin, async (req, res)=> {
  try {
    const admin = await getAdminByID(req.auth.adminId);

    if (admin?.role != "super-admin")
        return res.status(401).json({error: "Unauthorized"});

    const teamID = req.body?.teamID;
    if (!teamID) return req.status(400).json({error: "Missing Feilds"});

    const delres = await deleteTeam(teamID)
    return res.status(delres.success ? 200: 400).json(delres)

  }
  catch (err) {
    console.error("delete teams failed", err);
    return res.status(500).json({ success: false,  error: "Delete Failed"});
  }
});


router.post("/delete-submission", authenticateAdmin, async (req, res)=> {
  try {
    const admin = await getAdminByID(req.auth.adminId);

    if (admin?.role != "super-admin")
        return res.status(401).json({error: "Unauthorized"});

    const teamID = req.body?.teamID;
    if (!teamID) return req.status(400).json({error: "Missing Feilds"});

    const delres = await deleteSubmission(teamID);
    return res.status(delres.success ? 200: 400).json(delres)

  }
  catch (err) {
    console.error("delete submission failed", err);
    return res.status(500).json({ success: false,  error: "Delete Failed"});
  }
});

router.post("/update-college", authenticateAdmin, async (req, res)=> {
  try {
    const admin = await getAdminByID(req.auth.adminId);

    if (admin?.role != "super-admin")
        return res.status(401).json({error: "Unauthorized"});

    const userID = req.body?.userID;
    const clgName = req.body?.clgName;
    if (!userID || !clgName) return req.status(400).json({error: "Missing Feilds"});

    const update_res = await updateCollege(userID, clgName);
    return res.status(update_res.success ? 200: 400).json(update_res)

  }
  catch (err) {
    console.error("college name updated failed", err);
    return res.status(500).json({ success: false,  error: "Update Failed"});
  }
});



export default router;

