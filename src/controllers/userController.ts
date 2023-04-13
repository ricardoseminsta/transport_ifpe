import { Request, Response } from "express";
import * as UserService from "../services/userService";
import * as MailService from "../services/mailService";
import JWT, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

export const ping = (req: Request, res: Response) => {
  console.log("ping");

  res.json({ pong: true });
};

export const index = (req: Request, res: Response) => {
  res.render("pages/index");
};

export const getLogin = async (req: Request, res: Response) => {
  let isLogged = false;
  let cookie = req.headers.cookie?.split("=");
  let decoded = [] as JwtPayload;

  if (cookie) {
    let decoded = await UserService.decodedUser(cookie[1]);
    console.log(decoded);
    isLogged = true;
    return res.render("pages/user/login", { isLogged, decoded });
  }

  // console.log(req.headers.authorization);
  return res.render("pages/user/login", { isLogged, decoded });
};

export const login = async (req: Request, res: Response) => {
  res.clearCookie("connect.sid");
  res.clearCookie("auth");
  if (req.body.email && req.body.password) {
    let email: string = req.body.email;
    let password: string = req.body.password;

    if (validator.isEmail(email)) {
      const user = await UserService.findByEmail(email);

      if (user && bcrypt.compareSync(password, user.password)) {
        const token = await UserService.signUser(
          user.id,
          user.email,
          user.profile
        );
        req.headers.authorization = "Bearer " + token;
        // console.log("token do form: ", req.headers.authorization);
        // Cookies.set("auth", req.headers.authorization);
        res.cookie("auth", req.headers.authorization);
        // console.log(req.cookies);
        return res.redirect(`/user/${user.id}`);
      }
    }
    return res.render("pages/error", { message: "Digite um email válido" });
  }
  return res.redirect("/login");
};

export const getRegister = (req: Request, res: Response) => {
  res.render("pages/user/register");
};

export const register = async (req: Request, res: Response) => {
  let cookie = req.headers.cookie?.split("=");

  if (cookie) {
    if (req.body.email && req.body.password && req.body.profile) {
      let { email, password, name, profile } = req.body;
      if (validator.isEmail(email)) {
        const newUser = await UserService.createUser(
          email,
          name,
          password,
          profile
        );
        if (newUser instanceof Error) {
          return res.render("pages/error", { message: newUser });
        }
        return res.redirect("user/list");
      }
      return res.render("pages/error", { message: "Digite um email válido" });
    }
  } else {
    res.clearCookie("connect.sid");
    res.clearCookie("auth");
    if (req.body.email && req.body.password && req.body.profile) {
      let { email, password, name, profile } = req.body;
      if (validator.isEmail(email)) {
        const newUser = await UserService.createUser(
          email,
          name,
          password,
          profile
        );
        if (newUser instanceof Error) {
          return res.render("pages/error", { message: newUser });
        } else {
          res.status(201);
          const token = await UserService.signUser(
            newUser.id,
            newUser.email,
            newUser.profile
          );
          req.headers.authorization = "Bearer " + token;
          res.cookie("auth", req.headers.authorization);
          return res.redirect("/");
        }
      }
      return res.render("pages/error", { message: "Digite um email válido" });
    }
  }
  return res.redirect("user/list");
};

export const redirectUser = async (req: Request, res: Response) => {
  let decodedUser = await UserService.decodedUser(
    req.headers.authorization as string
  );
  if (decodedUser) {
    return res.redirect(`user/${decodedUser.id}`);
  }
};

export const user = async (req: Request, res: Response) => {
  let id: number = parseInt(req.params.id);
  if (isNaN(id)) return res.render("pages/error", { message: "URL inválida" });

  const user = await UserService.findById(id);
  let decodedUser = await UserService.decodedUser(
    req.headers.authorization as string
  );

  if (decodedUser) {
    if (decodedUser.id === id) {
      const id = decodedUser.id;
      const email = decodedUser.email;
      const profile = await UserService.getProfile(decodedUser.id);
      return res.render("pages/user/user", { id, email, profile, decodedUser });
    }

    if (decodedUser.profile === 1001 && user) {
      let id = user.id;
      let email = user.email;
      let profile = await UserService.getProfile(user.id);
      console.log("SUPER USER");
      return res.render(`pages/user/user`, { id, email, profile, decodedUser });
    }
    return res.redirect(`/user/${decodedUser.id}`);
  }
  return res.render("pages/error", {
    message: "Usuario Inexistente",
  });
};

export const getUpdate = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  if (isNaN(id)) return res.render("pages/error", { message: "URL inválida" });
  const user = await UserService.findById(id);
  let decodedUser = await UserService.decodedUser(
    req.headers.authorization as string
  );

  if (decodedUser) {
    if (decodedUser.id === id) {
      let id = decodedUser.id;
      let email = decodedUser.email;
      let name = decodedUser.name;
      let profile = await UserService.getProfile(decodedUser.id);
      return res.render("pages/user/update", { id, email, profile, name });
    }

    if (decodedUser.profile === 1001 && user) {
      let id = user.id;
      let email = user.email;
      let name = user.name;
      let profile = await UserService.getProfile(user.id);
      console.log("SUPER USER");
      return res.render(`pages/user/update`, { id, email, profile, name });
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
  let name = req.body.nname as string;
  let profile = parseInt(req.body.nprofile);

  let decodedUser = await UserService.decodedUser(
    req.headers.authorization as string
  );
  if (decodedUser) {
    if (decodedUser.profile !== 1001 || decodedUser.id === id) {
      const updateUser = await UserService.updateUserById(
        id,
        email,
        name,
        profile
      );
      const token = await UserService.signUser(id, email, profile);

      req.headers.authorization = "Bearer " + token;
      res.cookie("auth", req.headers.authorization);

      if (updateUser instanceof Error) {
        return res.render("/error", {
          message:
            "ocorreu um erro durante o cadastro, por favor recarregue a pagina!",
        });
      }

      return res.redirect(`/user/${id}`);
    }
    await UserService.updateUserById(id, name, email, profile);
    // console.log("USER contoller USER", id, email, name, profile);
    return res.redirect(`/user/list`);
  }
};

export const list = async (req: Request, res: Response) => {
  let decodedUser = await UserService.decodedUser(
    req.headers.authorization as string
  );

  if (decodedUser) {
    if (decodedUser.profile == 1001) {
      let users = await UserService.allActive();
      let list: string[] = [];

      for (let i in users) {
        let profile = (await UserService.getProfile(users[i].id)) as string;
        list.push(profile);
      }
      console.log(list);

      return res.render("pages/user/list", { users, list });
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
