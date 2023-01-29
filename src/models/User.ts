import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";
import bcrypt from "bcrypt";

import { ProfileType } from "../types/ProfileType";
export interface UserInstance extends Model {
  id: number;
  email: string;
  password: string;
  profile: "SU01" | "SP88" | "PR10" | "MT18" | string;
  active: boolean;
}

export const User = sequelize.define<UserInstance>(
  "User",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

async () => {
  await sequelize.sync({ force: true });
  await User.create({
    email: "ricardo",
    password: bcrypt.hashSync("123", 10),
    profile: "SU01",
  });
  await User.create({
    email: "joana",
    password: bcrypt.hashSync("123", 10),
    profile: "SP88",
  });
  await User.create({
    email: "joao",
    password: bcrypt.hashSync("123", 10),
    profile: "PR10",
  });
  await User.create({
    email: "daniel",
    password: bcrypt.hashSync("123", 10),
    profile: "PR10",
  });
  await User.create({
    email: "danilo",
    password: bcrypt.hashSync("123", 10),
    profile: "MT18",
  });
  await User.create({
    email: "james",
    password: bcrypt.hashSync("123", 10),
    profile: "MT18",
  });
};
