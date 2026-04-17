import db from "../models/index.js";

class UserService {
  async createUser(data) {
    try {
      const user = await db.User.create(data);
      return user;
    } catch (err) {
      return { error: err.message };
    }
  }

  async getUserById(id) {
    try {
      const user = await db.User.findById({ _id: id });
      return user;
    } catch (err) {
      return { error: err.message };
    }
  }

  async getUser(filter = {}) {
    try {
      const user = await db.User.findOne(filter);
      return user;
    } catch (err) {
      return { error: err.message };
    }
  }
}

export default new UserService();
