import { body, param, query } from "express-validator";

export const createTaskValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional(),
  body("status")
    .optional()
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Invalid status"),
  body("dueDate").optional().isISO8601().withMessage("Invalid date format"),
];

export const updateTaskValidation = [
  param("id").isMongoId().withMessage("Invalid task id"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("status")
    .optional()
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Invalid status"),
  body("dueDate").optional().isISO8601(),
];

export const getTaskByIdValidation = [
  param("id").isMongoId().withMessage("Invalid task id"),
];

export const getTasksValidation = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1 }),
  query("status")
    .optional()
    .isIn(["pending", "in_progress", "completed"]),
];