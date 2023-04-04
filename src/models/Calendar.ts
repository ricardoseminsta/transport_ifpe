import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";
import bcrypt from "bcrypt";

export interface CalendarInstance extends Model {
  id: number;
  requester: string;
  destination: string;
  active: boolean;
}

export const Calendar = sequelize.define<CalendarInstance>(
  "Calendar",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    requester: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      defaultValue: "Andrea Dacal",
    },
    destination: {
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
    tableName: "calendar",
    timestamps: true,
  }
);

async () => {
  await sequelize.sync({ force: true });
  await Calendar.create({
    requester: "Ricardo Emanuel",
    password: bcrypt.hashSync("123", 10),
    profile: 1001,
  });
};
