import { Request, Response } from "express";
import * as UserService from "../services/userService";

export const index = (req: Request, res: Response) => {
  res.render("pages/calendar/list");
};
