import express from "express";
const router = express.Router();
import { createUser, loginUser } from "../controllers/auth.controller.js";
import {
  createUserValidation,
  loginValidation,
} from "../validations/user.validation.js";
import { validation } from "../middlewares/index.js";

router.post("/register", createUserValidation, validation, createUser);
router.post("/login", loginValidation, validation, loginUser);

export default router;
