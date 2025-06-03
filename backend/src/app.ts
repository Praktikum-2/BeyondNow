// import express, { Express, Request, Response, NextFunction } from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.routes";
// console.log("TEST");
// import "./config/firebaseAdmin";
// // Import other routes as you create them
// // import departmentRoutes from './routes/department.routes';
// // import projectRoutes from './routes/project.routes';

// dotenv.config(); // Load environment variables

// const app: Express = express();

// // Middlewares
// app.use(cors()); // Enable CORS for all routes (configure origins in production)
// app.use(express.json()); // Parse JSON request bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// // Initialize Firebase Admin SDK (by importing it, it should initialize itself)

// // API Routes
// app.use("/api/auth", authRoutes);
// // Mount other routes here
// // app.use('/api/departments', departmentRoutes);
// // app.use('/api/projects', projectRoutes);

// // Simple root route
// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript + Prisma + Firebase Auth Backend Server");
// });

// // Global error handler (basic example)
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err.stack);
//   res.status(500).send({ message: "Something broke!", error: err.message });
// });

// export default app;
