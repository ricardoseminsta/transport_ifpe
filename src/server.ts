import express, { Request, Response, ErrorRequestHandler } from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import calendarRoutes from "./routes/calendarRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const server = express();

server.use(cors());

server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));

server.use(express.static(path.join(__dirname, "../public")));
server.use(express.urlencoded({ extended: true }));

server.get("/ping", (req: Request, res: Response) => res.json({ pong: true }));

server.use(userRoutes);
server.use(calendarRoutes);
server.use(cookieParser());

server.use((req: Request, res: Response) => {
  res.status(404);
  res.render("pages/404");
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(400); // Bad Request
  console.log(err);
  res.json({ error: "Ocorreu algum erro." });
};
server.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log("server started at port " + process.env.PORT);
});
