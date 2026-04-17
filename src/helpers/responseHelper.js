import fs from "fs";
import moment from "moment";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import morgan from "morgan";
import {
  SUCCESS,
  AUTH_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} from "./utils/statusCodes.js";

// --- Response Helpers ---
export const OK = (res, description = "", data, status = SUCCESS) => {
  res.status(200).json({
    status: status,
    message: description || "",
    data: data || null,
  });
};

export const ERROR = (res, description, data, status = SUCCESS) => {
  res.status(200).json({
    status: status,
    message: description || "",
    data: data || null,
  });
};

export const BAD_REQUEST_RESPONSE = (res, description) => {
  res.status(400).json({
    status: BAD_REQUEST,
    message: description || "",
    data: null,
  });
};

export const AUTH_ERROR_RESPONSE = (res, description) => {
  res.status(401).json({
    status: AUTH_ERROR,
    message: description || "",
    data: null,
  });
};

export const FORBIDDEN_RESPONSE = (res, description) => {
  res.status(403).json({
    status: FORBIDDEN,
    message: description || "Access denied",
    data: null,
  });
};

export const NOT_FOUND_RESPONSE = (res, description) => {
  res.status(404).json({
    status: NOT_FOUND,
    message: description || "Resource not found",
    data: null,
  });
};

export const INTERNAL_SERVER_ERROR_RESPONSE = (res, description, error, status = INTERNAL_SERVER_ERROR) => {
  res.status(500).json({
    status: status,
    message: description || "",
    data: null,
  });
};

export const UNHANDLED_INTERNAL_SERVER_ERROR = (error) => {
  if (error instanceof Error) {
    return { description: error.message || "", trace: error.stack };
  } else {
    const errorMessage = typeof error === "string" ? error : error?.message || "";
    const errorInstance = new Error(errorMessage);
    return { description: errorInstance.message || "", trace: errorInstance.stack, data: JSON.stringify(error) };
  }
};

// Get current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOGS_DIR_PATH = join(__dirname, "..", "logs");

// Ensure log directories exist
const successLogDir = join(LOGS_DIR_PATH, "success");
const errorLogDir = join(LOGS_DIR_PATH, "errors");
if (!fs.existsSync(successLogDir))
  fs.mkdirSync(successLogDir, { recursive: true });
if (!fs.existsSync(errorLogDir)) fs.mkdirSync(errorLogDir, { recursive: true });

// --- Morgan Configuration ---
const getLogFilePath = (dir, type) => {
  const date = moment().format("YYYY-MM-DD");
  return join(dir, `${date}_${type}.log`);
};

// Write streams
const successStream = {
  write: (message) => {
    fs.appendFileSync(getLogFilePath(successLogDir, "success"), message);
  },
};

const errorStream = {
  write: (message) => {
    fs.appendFileSync(getLogFilePath(errorLogDir, "errors"), message);
  },
};

// Middleware to capture response body
export const captureResponseData = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    res.locals.body = body;
    return originalJson.call(this, body);
  };
  next();
};

// Custom tokens
morgan.token("custom-date",() => `[${moment().format("ddd, MMM DD, YYYY h:mm A")}]`);
morgan.token("description",(req, res) => res.locals.body?.message || "No description");

const logFormat = ":custom-date status::status description::description :method :url :status :response-time ms - :remote-addr";

export const successLogger = morgan(logFormat, {
  stream: successStream,
  skip: (req, res) => res.statusCode >= 400,
});

export const errorLogger = morgan(logFormat, {
  stream: errorStream,
  skip: (req, res) => res.statusCode < 400,
});


