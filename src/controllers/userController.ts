import { Request, Response } from "express";
import * as UserService from "../services/userService";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ProfileType } from "../types/ProfileType";

export const ping = (req: Request, res: Response) => {
  console.log("ping");

  res.json({ pong: true });
};

export const index = (req: Request, res: Response) => {
  res.render("pages/index");
};

export const getLogin = (req: Request, res: Response) => {
  let isLogged = false;
  let decoded = {};

  console.log("COOKIE GETlOGIN: ", req.headers.cookie);
  let cookie = req.headers.cookie?.split("=");

  if (cookie) {
    if (cookie[0] === "auth") {
      cookie[1] = decodeURI(cookie[1]);
      req.headers.authorization = cookie[1];
    }
  }
  if (req.headers.authorization) {
    const [authType, token] = req.headers.authorization.split(" ");
    if (authType === "Bearer") {
      // console.log("TOKEN", token);
      try {
        decoded = JWT.verify(token, process.env.JWT_SECRET_KEY as string);
        console.log("DECODED", decoded);
        isLogged = true;
      } catch (error) {}
    }
  }

  // console.log(req.headers.authorization);
  res.render("pages/user/login", { isLogged, decoded });
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
      // Cookies.set("auth", req.headers.authorization);
      res.cookie("auth", req.headers.authorization);
      // console.log(req.cookies);

      res.render("pages/index");
      return;
    }
  }

  res.redirect("/login");
};

export const getRegister = (req: Request, res: Response) => {
  res.render("pages/user/register");
};

export const register = async (req: Request, res: Response) => {
  if (req.body.email && req.body.password && req.body.profile) {
    let { email, password, profile } = req.body;

    const newUser = await UserService.createUser(email, password, profile);
    if (newUser instanceof Error) {
      return res.render("pages/error", { newUser });
    } else {
      res.status(201);
      const token = JWT.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "12h" }
      );
      req.headers.authorization = "Bearer " + token;
      res.cookie("auth", req.headers.authorization);
      res.redirect("/");
      return;
    }
  }
  res.redirect("/register");
};

export const getUpdate = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const user = await UserService.findById(id);

  let textProfile = "";
  if (user) {
    switch (user.profile as string) {
      case "SP88":
        textProfile = "Servidor";
        break;
      case "PR10":
        textProfile = "Portaria";
        break;
      case "MT18":
        textProfile = "Motorista";
        break;
    }
  }

  res.render("pages/user/user", { user, textProfile });
};

export const update = async (req: Request, res: Response) => {
  let id = parseInt(req.body.id);
  let email = req.body.nemail as string;
  let profile = req.body.nprofile as string;

  const updateUser = UserService.updateUserById(id, email, profile);

  if (updateUser instanceof Error) {
    return res.render("pages/error", { updateUser });
  }

  res.redirect("/user/list");
};

export const list = async (req: Request, res: Response) => {
  let users = await UserService.allActive();
  let list: string[] = [];

  for (let i in users) {
    list.push(users[i].email);
  }
  console.log(users[0].email);

  res.render("pages/user/list", { users });
};

export const deleteUser = (req: Request, res: Response) => {
  let id = parseInt(req.body.id);
  console.log("controller delete id ", id);

  UserService.deleteUser(id);
  res.redirect("/user/list");
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("auth");
  res.redirect("/login");
};
