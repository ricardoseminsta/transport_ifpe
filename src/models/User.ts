import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";
import bcrypt from "bcrypt";

import { ProfileType } from "../types/ProfileType";
export interface UserInstance extends Model {
  id: number;
  email: string;
  name: string;
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
    name: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
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
    email: "ricardo.silva@afogados.ifpe.edu.br",
    name: "Ricardo Silva",
    password: bcrypt.hashSync("123", 10),
    profile: 1001,
  });
  await User.create({
    email: "joana",
    name: "Joana Vitória",
    password: bcrypt.hashSync("123", 10),
    profile: 2002,
  });
  await User.create({
    email: "joao",
    name: "João Budelo",
    password: bcrypt.hashSync("123", 10),
    profile: 3001,
  });
  await User.create({
    email: "daniel",
    name: "Daniel Ferreira",
    password: bcrypt.hashSync("123", 10),
    profile: 3001,
  });
  await User.create({
    email: "danilo",
    name: "Danilo Silva",
    password: bcrypt.hashSync("123", 10),
    profile: 4001,
  });
  await User.create({
    email: "james",
    name: "James Henrique",
    password: bcrypt.hashSync("123", 10),
    profile: 4001,
  });
};
