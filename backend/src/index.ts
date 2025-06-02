import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./db";
import { projectRoutes } from "./routes/ProjectsRoutes";
import { employeeRoutes } from "./routes/employeesRoutes";
import { SkillsRoutes } from "./routes/SkillsRoutes";
import DepartmentsRoutes from "./routes/DepartmentsRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

var dotenv = require("dotenv");
app.use(cors());
app.use(express.json());
app.use("/projects", projectRoutes);
app.use("/employees", employeeRoutes);
app.use("/skills", SkillsRoutes);
app.use("/departments", DepartmentsRoutes);

app.get("/", async (req, res) => {
  const count = await prisma.employee.count();
  res.send(`There are ${count} developers in the database.`);
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
