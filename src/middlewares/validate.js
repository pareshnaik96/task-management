import { validationResult } from "express-validator";
import { BAD_REQUEST_RESPONSE } from "../helpers/responseHelper.js";

export const validation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return BAD_REQUEST_RESPONSE(res,errors.array()[0].msg);
    }

    next();
};