import { Router } from "express";
import { Auth } from "../middlewares/auth";

import * as UserController from "../controllers/userController";

const router = Router();

router.post("/register", UserController.register);

router.get("/login", UserController.getLogin);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);

router.get("/", Auth.private, UserController.index);

router.get("/list", Auth.private, UserController.list);

export default router;
