import UserModel from "../models/user.model";
import { BadRequestException, UnauthorizedException } from "../utils/app-error";
import {
  LoginSchemaType,
  RegisterSchemaType,
} from "../validators/auth.validator";

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new BadRequestException("User already exist");
  }

  const newUser = new UserModel({ ...body });
  await newUser.save();

  return newUser;
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new UnauthorizedException("Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new UnauthorizedException("Invalid credentials");
  }

  return user;
};
