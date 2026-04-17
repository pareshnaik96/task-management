import jwt from "jsonwebtoken";
import {
  AUTH_ERROR_RESPONSE ,
} from "../helpers/responseHelper.js";
import 'dotenv/config';

export const authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return AUTH_ERROR_RESPONSE(res, "Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return AUTH_ERROR_RESPONSE(res, "Invalid or expired token");
  }
};
