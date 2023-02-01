import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";
import bcrypt from "bcrypt";

import { ProfileType } from "../types/ProfileType";
export interface UserInstance extends Model {
  id: number;
  email: string;
  password: string;
  profile: 1001 | 2001 | 2002 | 3001 | 4001;
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
      type: DataTypes.INTEGER,
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
    profile: 1001,
  });
  await User.create({
    email: "joana",
    password: bcrypt.hashSync("123", 10),
    profile: 2002,
  });
  await User.create({
    email: "joao",
    password: bcrypt.hashSync("123", 10),
    profile: 3001,
  });
  await User.create({
    email: "daniel",
    password: bcrypt.hashSync("123", 10),
    profile: 3001,
  });
  await User.create({
    email: "danilo",
    password: bcrypt.hashSync("123", 10),
    profile: 4001,
  });
  await User.create({
    email: "james",
    password: bcrypt.hashSync("123", 10),
    profile: 4001,
  });
};
