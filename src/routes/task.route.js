import express from "express";
const router = express.Router();
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { authentication, validation } from "../middlewares/index.js";
import {
  createTaskValidation,
  updateTaskValidation,
  getTaskByIdValidation,
  getTasksValidation,
} from "../validations/task.validation.js";

router.post("/", authentication, createTaskValidation, validation, createTask);
router.get("/", authentication, getTasksValidation, validation, getTasks);
router.get("/:id", authentication, getTaskByIdValidation, validation, getTaskById);
router.put("/:id", authentication, updateTaskValidation, validation, updateTask);
router.delete("/:id", authentication, getTaskByIdValidation, validation, deleteTask);

export default router;
