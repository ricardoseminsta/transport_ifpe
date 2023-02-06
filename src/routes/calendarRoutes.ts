import { Router } from "express";
import { Auth } from "../middlewares/auth";

import * as CalendarController from "../controllers/calendarController";

const router = Router();
router.get("/calendar", CalendarController.index);
export default router;
