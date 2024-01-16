import logger from "../../utils/logger.js";

export default class CustomError {
  static createError({ name = "Error", cause, message, code = 1 }) {
    let error = new CustomError(message);
    error.name = name;
    error.code = code;
    error.cause = cause;

    logger.error(`${error.name} - ${error.message}`, {
      code: error.code,
      cause: error.cause,
    });

    return error;
  }
}
