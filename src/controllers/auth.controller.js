import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
import { userService } from "../services/index.js";
import "dotenv/config";


export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userService.getUser({ email: email });
    if (existingUser) {
      return BAD_REQUEST_RESPONSE(res, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const reqBody = {
      name: name,
      email: email,
      password: hashedPassword,
    };
    const user = await userService.createUser(reqBody);

    return OK(res, "User created successfully", user, SUCCESS);
  } catch (error) {
    return INTERNAL_SERVER_ERROR_RESPONSE(
      res,
      error.message || "Internal Server Error",
      INTERNAL_SERVER_ERROR,
    );
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.getUser({ email: email });
    if (!user) {
      return NOT_FOUND_RESPONSE(res, "User not found with the provided email!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return BAD_REQUEST_RESPONSE(res, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return OK(res, "Login successful", { token }, SUCCESS);
  } catch (error) {
    return INTERNAL_SERVER_ERROR_RESPONSE(
      res,
      error.message || "Internal Server Error",
      INTERNAL_SERVER_ERROR,
    );
  }
};


