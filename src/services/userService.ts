import { User } from "../models/User";
import bcrypt from "bcrypt";
import JWT, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

export const createUser = async (
  email: string,
  password: string,
  profile: string
) => {
  const hasUser = await User.findOne({ where: { email } });
  if (!hasUser) {
    const hash = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      email: email.toLocaleLowerCase(),
      password: hash,
      profile,
    });
    return newUser;
  } else {
    return new Error(`User ${email} already exists`);
  }
};

export const findByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export const findById = async (id: number) => {
  return await User.findOne({ where: { id } });
};

export const matchPassword = (passwordText: string, encrypted: string) => {
  return bcrypt.compareSync(passwordText, encrypted);
};

export const allActive = async () => {
  return await User.findAll({ where: { active: true } });
};

export const updateUserById = async (
  id: number,
  email?: string,
  profile?: string
) => {
  const user = await User.findOne({ where: { id } });
  if (user) {
    user.set({
      email: email?.toLocaleLowerCase(),
      profile,
    });
    await user.save();
    return;
  } else {
    return new Error(`User ${email} already exists`);
  }
};

export const getProfile = async (id: number) => {
  const user = await User.findByPk(id);
  if (user) {
    return user.profile;
  }
};

export const deleteUser = async (id: number) => {
  const user = await User.findByPk(id);
  if (user) {
    user.set({ active: false });
    await user.save();
  }
};

export const decodedUser = async (authorizationHearder: string) => {
  const [authType, token] = authorizationHearder.split(" ");
  if (authType === "Bearer") {
    // console.log("TOKEN", token);
    try {
      let decodedUser = JWT.verify(token, process.env.JWT_SECRET_KEY as string);
      return decodedUser as JwtPayload;
    } catch (error) {
      return undefined;
    }
  }
};
