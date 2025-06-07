import cors from "cors";
import "dotenv/config";
import express from "express";
import "./config/firebaseAdmin";
import { authMiddleware } from "./middlewares/auth.middleware";
import authRoutes from "./routes/auth.routes";
import DepartmentsRoutes from "./routes/DepartmentsRoutes";
import { employeeRoutes } from "./routes/employeesRoutes";
import organizationRoutes from "./routes/organization.routes";
import profileRoutes from "./routes/profile.routes";
import { projectRoutes } from "./routes/ProjectsRoutes";
import { SkillsRoutes } from "./routes/SkillsRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/projects", projectRoutes);
app.use("/employees", employeeRoutes);
app.use("/skills", SkillsRoutes);
app.use("/api/departments", authMiddleware, DepartmentsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/profile", profileRoutes);
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
