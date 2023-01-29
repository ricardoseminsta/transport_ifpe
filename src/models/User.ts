import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";

import { ProfileType } from "../types/ProfileType";
export interface UserInstance extends Model {
  id: number;
  email: string;
  password: string;
  profile: "SP88" | "PR10" | "MT18" | string;
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
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

// User.sync({ alter: true });
