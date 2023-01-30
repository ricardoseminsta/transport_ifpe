import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const Auth = {
  private: async (req: Request, res: Response, next: NextFunction) => {
    //fazer verificação de auth
    let success = false;
    // console.log("Autho  ", req.headers.cookie?.split("="));

    let cookie = req.headers.cookie?.split("=");

    if (cookie) {
      if (cookie[0] === "auth") {
        cookie[1] = decodeURI(cookie[1]);
        req.headers.authorization = cookie[1];
      }
    }
    // console.log("HEADER", req.headers.authorization);
    if (req.headers.authorization) {
      const [authType, token] = req.headers.authorization.split(" ");
      if (authType === "Bearer") {
        // console.log("TOKEN", token);
        try {
          const decoded = JWT.verify(
            token,
            process.env.JWT_SECRET_KEY as string
          );
          console.log("decoded", decoded);
          success = true;
        } catch (error) {}
      }
    }

    if (success) {
      next();
    } else {
      res.status(403); //Not authorized
      res.redirect("/login");
    }
  },
};
