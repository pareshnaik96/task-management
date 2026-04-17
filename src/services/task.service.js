import db from "../models/index.js";

class TaskService {
  async createTask(data) {
    return await db.Task.create(data);
  }

  async getTasks(filter, options) {
    const { page = 1, limit = 10 } = options;

    const tasks = await db.Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await db.Task.countDocuments(filter);

    return { tasks, total };
  }

  async getTaskById(id) {
    return await db.Task.findById(id);
  }

  async updateTask(id, data) {
    return await db.Task.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    );
  }

  async deleteTask(id) {
    return await db.Task.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );
  }
}

export default new TaskService();
