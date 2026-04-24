import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js"
import teamRoutes from "./routes/teams.js"
import submissionRoutes from "./routes/submission.js"
import adminRoutes from "./routes/admin.js"


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});


app.use("/auth", authRoutes);
app.use("/profile", profileRoutes)
app.use("/team", teamRoutes)
app.use("/submissions", submissionRoutes)
app.use("/admin", adminRoutes)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});