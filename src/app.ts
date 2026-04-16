import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import config from "./config/env.config";
import { specs, swaggerUi } from "./config/swagger";
import userRoutes from "./routes/User.Routes";
import jobRoutes from "./routes/Job.Routes";
import applicationRoutes from "./routes/Application.Routes";
import employerRoutes from "./routes/Employer.Routes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const corsOptions = {
  origin: config.corsOrigins?.length ? config.corsOrigins : true,
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Job Portal API Documentation",
}));

app.get("/", (_req, res) => res.json({ message: "Job Portal API is running!" }));

app.use("/api/auth", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
});

export default app;
