import { Router } from "express";
import { Auth } from "../middlewares/auth";

import * as UserController from "../controllers/userController";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/login", UserController.getlogin);

router.get("/", Auth.private, UserController.index);

router.get("/list", Auth.private, UserController.list);

export default router;
