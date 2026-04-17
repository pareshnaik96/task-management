import {
  OK,
  BAD_REQUEST_RESPONSE,
  NOT_FOUND_RESPONSE,
  INTERNAL_SERVER_ERROR_RESPONSE,
} from "../helpers/responseHelper.js";
import {
  SUCCESS,
  INTERNAL_SERVER_ERROR,
} from "../helpers/utils/statusCodes.js";
import { taskService } from "../services/index.js";


export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;

    const task = await taskService.createTask({
      ...req.body,
      userId,
    });

    return OK(res, "Task created successfully", task, SUCCESS);
  } catch (error) {
    return INTERNAL_SERVER_ERROR_RESPONSE(res, error.message, INTERNAL_SERVER_ERROR);
  }
};

export const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, title } = req.query;

    let filter = {
        isDeleted: false
    };
    // Role-based filtering
    if (req.user.role !== "admin") {
      filter.userId = req.user.id; // normal user → only own tasks
    }
    // Optional filters
    if (status) filter.status = status;
    if (title) filter.title = { $regex: title, $options: "i" };

    const result = await taskService.getTasks(filter, { page, limit });

    const totalPages = Math.ceil(result.total / limit);

    const response = {
      tasks: result.tasks,
      pagination: {
        total: result.total,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    };

    return OK(res, "Tasks fetched successfully", response, SUCCESS);
  } catch (error) {
    return INTERNAL_SERVER_ERROR_RESPONSE(res, error.message, INTERNAL_SERVER_ERROR);
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);

    if (!task || task.isDeleted) {
      return NOT_FOUND_RESPONSE(res, "Task not found");
    }

    if (task.userId.toString() !== req.user.id) {
      return BAD_REQUEST_RESPONSE(res, "Unauthorized access");
    }

    return OK(res, "Task fetched successfully", task, SUCCESS);
  } catch (error) {
    return INTERNAL_SERVER_ERROR_RESPONSE(res, error.message, INTERNAL_SERVER_ERROR);
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await taskService.getTaskById(req.params.id);
    if (!task || task.isDeleted) {
      return NOT_FOUND_RESPONSE(res, "Task not found");
    }

    if (task.userId.toString() !== req.user.id) {
      return BAD_REQUEST_RESPONSE(res, "Unauthorized");
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(status && { status }),
      ...(dueDate && { dueDate }),
    }
    const updated = await taskService.updateTask(req.params.id, updateData);

    return OK(res, "Task updated successfully", updated, SUCCESS);
  } catch (error) {
    return INTERNAL_SERVER_ERROR_RESPONSE(res, error.message, INTERNAL_SERVER_ERROR);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);

    if (!task || task.isDeleted) {
      return NOT_FOUND_RESPONSE(res, "Task not found");
    }

    if (task.userId.toString() !== req.user.id) {
      return BAD_REQUEST_RESPONSE(res, "Unauthorized");
    }

    await taskService.deleteTask(req.params.id);

    return OK(res, "Task deleted successfully", null, SUCCESS);
  } catch (error) {
    return INTERNAL_SERVER_ERROR_RESPONSE(res, error.message, INTERNAL_SERVER_ERROR);
  }
};