import { Request, Response, NextFunction } from "express";
import { loginSchema } from "./auth.schema";
import { authService } from "./auth.service";
import { env } from "../../config/env";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = loginSchema.parse(req.body);

      const { token, store } = await authService.login(data);

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: env.nodeEnv === "production",
          sameSite: "lax",
          maxAge: env.jwtCookieMaxAge,
          path: "/",
        })
        .status(200)
        .json({
          message: "Login realizado com sucesso",
          store,
        });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();