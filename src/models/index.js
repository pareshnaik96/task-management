import mongoose from "mongoose";
import User from "./user.model.js";
import Task from "./task.model.js";

export const db = {
    mongoose,
    User,
    Task,
};

export default db;
