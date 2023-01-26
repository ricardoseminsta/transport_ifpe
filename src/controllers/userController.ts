import { Request, Response } from "express";
import * as UserService from "../services/userService";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

export const ping = (req: Request, res: Response) => {
  console.log("ping");

  res.json({ pong: true });
};

export const index = (req: Request, res: Response) => {
  res.json({ list: "Lista de viagens" });
};

export const register = async (req: Request, res: Response) => {
  if (req.body.email && req.body.password) {
    let { email, password } = req.body;

    const newUser = await UserService.createUser(email, password);
    if (newUser instanceof Error) {
      return res.json({ error: newUser.message });
    } else {
      res.status(201);
      const token = JWT.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "2h" }
      );
      req.headers.authorization = "Bearer " + token;
      res.json({ id: newUser.id, token });
      return;
    }
  }

  res.json({ error: "E-mail e/ou senha não enviados." });
};

export const login = async (req: Request, res: Response) => {
  if (req.body.email && req.body.password) {
    let email: string = req.body.email;
    let password: string = req.body.password;

    const user = await UserService.findByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = JWT.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "12h" }
      );

      req.headers.authorization = "Bearer " + token;
      // console.log("token do form: ", req.headers.authorization);
      res.cookie("token name", "valor encriptado");
      console.log(req.cookies);

      res.json({ status: true, token });
      return;
    }
  }

  res.json({ status: false });
};

export const list = async (req: Request, res: Response) => {
  let users = await UserService.all();
  let list: string[] = [];

  for (let i in users) {
    list.push(users[i].email);
  }

  res.json({ list });
};
