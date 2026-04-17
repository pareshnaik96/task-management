import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import {
  captureResponseData,
  successLogger,
  errorLogger,
} from "./helpers/responseHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(process.cwd(), ".env");
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3000;

const initializeApp = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");
    app.use(cors({ origin: "*" })); // Enable CORS for all routes (you can configure this as needed)
    app.use(morgan(":method :url :status :response-time ms - :remote-addr"));
    // File logging (Custom format)
    app.use(successLogger);
    app.use(errorLogger);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use("/", routes);
    app.use((req, res) => {
      res.status(404).json({
        status: 404,
        message: "Route Not Found",
      });
    });
    // Global error handler
    app.use((err, req, res, next) => {
      console.error("Unhandled error:", err);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    });
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start application:", error);
    process.exit(1);
  }
};

initializeApp();

export default app;
