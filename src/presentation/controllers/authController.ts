import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../helper/authHelper";
import { UserModel } from "../../infrastructure/model/UserModel";
import JWT from "jsonwebtoken";




// REGISTER
export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).send({ error: "All fields required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered",
      });
    }

    const hashPass = await hashPassword(password);

    const user = await new UserModel({
      name,
      email,
      password: hashPass,
      phone,
    }).save();

    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// LOGIN
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send({ message: "Invalid password" });

    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.send({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};


//? TEST TOKEN
export const testController = (req: Request, res: Response) => {
  res.send("Token working");
};


