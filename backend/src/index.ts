import "dotenv/config";
import express from "express";
import cors from "cors";
import "./config/firebaseAdmin";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT;
var dotenv = require("dotenv");
authRoutes();

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
