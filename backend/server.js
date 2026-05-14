const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path=require("path");

dotenv.config(); // MUST come before connectDB()

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const departmentRoutes=require("./routes/departmentRoutes");
const issueRoutes=require("./routes/issueRoute");
const commentRoutes=require("./routes/commentRoute");
const notificationRoutes=require("./routes/notificationRoute");
const analyticsRoutes=require("./routes/analyticsRoute");
const activityRoutes=require("./routes/activityRoute");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/departments",departmentRoutes);
app.use("/api/issues",issueRoutes);
app.use("/api/comments",commentRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/analytics",analyticsRoutes);
app.use("/api/activities",activityRoutes);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});