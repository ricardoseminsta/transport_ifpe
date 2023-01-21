import { Router } from "express";

import * as UserController from "../controllers/userController";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/", UserController.index);

router.get("/list", UserController.list);

export default router;
