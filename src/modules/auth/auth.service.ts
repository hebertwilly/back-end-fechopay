import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { Store, StoreDocument } from "../store/store.model";
import { LoginDTO } from "./auth.schema";
import { env } from "../../config/env";

class AuthService {
  async login(data: LoginDTO) {
    const store = await Store.findOne({ email: data.email }).select("+password");

    if (!store) {
      throw new Error("Email ou senha inválidos");
    }

    const passwordIsValid = await bcrypt.compare(data.password, store.password);

    if (!passwordIsValid) {
      throw new Error("Email ou senha inválidos");
    }

    const token = jwt.sign(
      {
        sub: store._id.toString(),
        email: store.email,
        slug: store.slug,
      },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
      }
    );

    const storeObject = store.toObject();
    const { password, ...storeWithoutPassword } = storeObject;

    return {
      token,
      store: storeWithoutPassword,
    };
  }
}

export const authService = new AuthService();