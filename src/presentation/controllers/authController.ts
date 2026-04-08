import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../helper/authHelper";
import JWT from "jsonwebtoken";
import { UserRepository } from "../../infrastructure/UserRepository";

const userRepo = new UserRepository();

// REGISTER
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
    res.status(200).send({
      status: true,
      success: true,
      user: safeUser,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// LOGIN
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.getUserByEmail(email);
    if (!user) return res.status(404).send({ message: "User not found" });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send({ message: "Invalid password" });

    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );
    const { password: _, ...safeUser } = user.toObject();
    res.send({
      status: true,
      success: true,
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

//? GET AGENTS
export const getAgentsController = async (req: Request, res: Response) => {
  try {
    let agent = await userRepo.getAgents();

    if (!agent || agent.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No agents available for task assignment",
      });
    }

    res
      .status(200)
      .send({
        status: true,
        success: true,
        message: "Agent fetched successfully",
        agent,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Can't find agent",
      error,
    });
  }
};

//? TEST TOKEN
export const testController = (req: Request, res: Response) => {
  res.send("Token working");
};
