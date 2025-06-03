import cors from "cors";
import "dotenv/config";
import express from "express";
import { projectRoutes } from "./routes/ProjectsRoutes";
import { employeeRoutes } from "./routes/employeesRoutes";
import { SkillsRoutes } from "./routes/SkillsRoutes";
import DepartmentsRoutes from "./routes/DepartmentsRoutes";
import "./config/firebaseAdmin";
import authRoutes from "./routes/auth.routes";
import organizationRoutes from "./routes/organization.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/projects", projectRoutes);
app.use("/employees", employeeRoutes);
app.use("/skills", SkillsRoutes);
app.use("/departments", DepartmentsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/organization", organizationRoutes);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
