import { User } from "../models/User";
import bcrypt from "bcrypt";

export const createUser = async (
  email: string,
  password: string,
  profile: string
) => {
  const hasUser = await User.findOne({ where: { email } });
  if (!hasUser) {
    const hash = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      email,
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

export const matchPassword = (passwordText: string, encrypted: string) => {
  return bcrypt.compareSync(passwordText, encrypted);
};

export const all = async () => {
  return await User.findAll();
};
