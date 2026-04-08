import { Request, Response } from "express";
import JWT from "jsonwebtoken";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { comparePassword, hashPassword } from "../helper/authHelper";

const userRepo = new UserRepository();

export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).send({ error: "All fields required" });
    }

    const existingUser = await userRepo.getUserByEmail(email);

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered",
      });
    }

    const hashPass = await hashPassword(password);

    const user = await userRepo.createUser({
      name,
      email,
      password: hashPass,
      phone,
    });

    const { password: _, ...safeUser } = user.toObject();

    return res.status(200).send({
      status: true,
      success: true,
      user: safeUser,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).send({ success: false, error });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.getUserByEmail(email);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({ message: "Invalid password" });
    }

    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    const { password: _, ...safeUser } = user.toObject();

    return res.send({
      status: true,
      success: true,
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (error) {
    return res.status(500).send({ success: false, error });
  }
};

export const testController = (req: Request, res: Response) => {
  res.send("Token working");
};
