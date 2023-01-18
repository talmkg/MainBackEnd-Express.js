import { checkSchema, validationResult } from "express-validator";

const login_schema = {
  nickname: {
    in: ["body"],
    isString: {
      errorMessage: "title validation failed , type must be string  ",
    },
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "nickname validation failed , type must be string ",
    },
  },
};
const signup_schema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "nickname validation failed , type must be string ",
    },
  },
  surname: {
    in: ["body"],
    isString: {
      errorMessage: "nickname validation failed , type must be string ",
    },
  },
  nickname: {
    in: ["body"],
    isString: {
      errorMessage: "title validation failed , type must be string  ",
    },
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "nickname validation failed , type must be string ",
    },
  },
  //   image: {
  //     in: ["body"],
  //     isString: {
  //       errorMessage: "nickname validation failed , type must be string ",
  //     },
  //   },
};

export const loginSchema = checkSchema(login_schema);
export const signupSchema = checkSchema(signup_schema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Users validation failed.");
    error.status = 400;
    error.errors = errors.array();
    next(error);
  }
  next();
};
