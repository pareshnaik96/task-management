import express from "express";
import authRouter from "./auth.route.js";
import taskRouter from "./task.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/tasks", taskRouter);

export default router;
