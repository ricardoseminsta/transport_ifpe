import { Request, Response } from "express";
import * as UserService from "../services/userService";
import * as MailService from "../services/mailService";
import JWT, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

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
        decoded = JWT.verify(
          token,
          process.env.JWT_SECRET_KEY as string
        ) as JwtPayload;
        console.log("DECODED", decoded);
        isLogged = true;
      } catch (error) {}
    }
  }

  // console.log(req.headers.authorization);
  res.render("pages/user/login", { isLogged, decoded });
};

export const login = async (req: Request, res: Response) => {
  res.clearCookie("connect.sid");
  res.clearCookie("auth");
  if (req.body.email && req.body.password) {
    let email: string = req.body.email;
    let password: string = req.body.password;

    const user = await UserService.findByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = JWT.sign(
        { id: user.id, email: user.email, profile: user.profile },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "12h" }
      );
      req.headers.authorization = "Bearer " + token;
      // console.log("token do form: ", req.headers.authorization);
      // Cookies.set("auth", req.headers.authorization);
      res.cookie("auth", req.headers.authorization);
      // console.log(req.cookies);
      res.redirect(`/user/${user.id}`);
      return;
    }
  }

  res.redirect("/login");
};

export const getRegister = (req: Request, res: Response) => {
  res.render("pages/user/register");
};

export const register = async (req: Request, res: Response) => {
  res.clearCookie("connect.sid");
  res.clearCookie("auth");
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

export const user = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  let decodedUser = await UserService.decodedUser(
    req.headers.authorization as string
  );

  if (decodedUser) {
    if (decodedUser.id === id) {
      const id = decodedUser.id;
      const email = decodedUser.email;
      const profile = await UserService.getProfile(decodedUser.id);
      return res.render("pages/user/user", { id, email, profile });
    }
    return res.redirect(`/user/${decodedUser.id}`);
  }
  return res.render("pages/error", {
    message: "Usuario Inexistente",
  });
};

export const getUpdate = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  let decodedUser = await UserService.decodedUser(
    req.headers.authorization as string
  );

  if (decodedUser) {
    if (decodedUser.id === id) {
      const id = decodedUser.id;
      const email = decodedUser.email;
      const profile = await UserService.getProfile(decodedUser.id);
      return res.render("pages/user/update", { id, email, profile });
    }
    return res.redirect(`/user/update/${decodedUser.id}`);
  }
  return res.render("pages/error", {
    message: "Usuario Inexistente",
  });
};

export const update = async (req: Request, res: Response) => {
  let id = parseInt(req.body.id);
  let email = req.body.nemail as string;
  let profile = req.body.nprofile as string;

  const updateUser = UserService.updateUserById(id, email, profile);
  const token = JWT.sign(
    { id, email, profile },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "12h" }
  );
  req.headers.authorization = "Bearer " + token;
  res.cookie("auth", req.headers.authorization);

  if (updateUser instanceof Error) {
    return res.render("/error", {
      message:
        "ocorreu um erro durante o cadastro, por favor recarregue a pagina!",
    });
  }

  res.redirect(`/user/${id}`);
};

export const list = async (req: Request, res: Response) => {
  let decodedUser = await UserService.decodedUser(
    req.headers.authorization as string
  );

  if (decodedUser) {
    if (decodedUser.profile == "SU01") {
      let users = await UserService.allActive();
      let list: string[] = [];

      for (let i in users) {
        list.push(users[i].email);
      }
      console.log(users[0].email);

      return res.render("pages/user/list", { users });
    }
  }
  return res.render("pages/error", {
    message: "O seu Perfil de usuário não tem acesso a essa página",
  });
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
