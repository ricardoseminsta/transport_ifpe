import { Router } from "express";
import { Auth } from "../middlewares/auth";

import * as UserController from "../controllers/userController";

const router = Router();

router.post("/register", UserController.register);
router.get("/register", UserController.getRegister);

router.get("/login", UserController.getLogin);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);

router.get("/user/list", Auth.private, UserController.list);
router.get("/user/:id", Auth.private, UserController.getUpdate);
router.post("/user", Auth.private, UserController.update);
router.post("/user/delete", Auth.private, UserController.deleteUser);

router.get("/", Auth.private, UserController.index);

export default router;
