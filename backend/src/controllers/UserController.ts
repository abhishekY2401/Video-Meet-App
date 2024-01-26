import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export interface DataResponse {
  code: string;
  data: any;
}

export const authenticateUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { username, email, pass } = req.body;

  const result = await loginUser({ email, pass });

  if (result && result.code === "400") {
    const registeredUser = await registerUser({
      username,
      email,
      pass,
    });
    if (registeredUser.code === "200") {
      res.status(200).json(registeredUser.data);
    } else {
      res.status(500).json(registeredUser.data);
    }
  }

  if (result && result.code === "401") {
    res.status(400).json("Invalid Password");
  }

  res.status(200).json(result);
};

export const registerUser = async ({
  username,
  email,
  pass,
}: {
  username: string;
  email: string;
  pass: string;
}) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    const newUser = new User({
      username: username,
      email: email,
      pass: hashedPassword,
    });

    const user = await newUser.save();
    console.log("user successfully created!");

    // return user response
    const response: DataResponse = {
      code: "200",
      data: user,
    };

    return response;
  } catch (error) {
    // return error
    const response: DataResponse = {
      code: "500",
      data: error,
    };
    return response;
  }
};

export const loginUser = async ({
  email,
  pass,
}: {
  email: string;
  pass: string;
}) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const response: DataResponse = {
        code: "400",
        data: "Email does not exists",
      };
      return response;
    }
    const validatePass = await bcrypt.compare(pass, user.password);
    if (!validatePass) {
      const response: DataResponse = {
        code: "401",
        data: "Wrong password, please enter it correctly",
      };
      return response;
    }

    const userResponse: DataResponse = {
      code: "200",
      data: user,
    };

    return userResponse;
  } catch (error) {
    const errResponse: DataResponse = {
      code: "500",
      data: "Login Failed",
    };

    return errResponse;
  }
};
