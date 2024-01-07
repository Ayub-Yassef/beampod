import { CreateUser } from "#/@types/user";
import { RequestHandler } from "express";
import User from '#/models/user';
import { sendVerificationMail } from "#/utils/mail";
import { generateToken } from "#/utils/helper";


export const create: RequestHandler = async (req: CreateUser, res) => {
const { email, password, name } = req.body;

const user = await User.create({ name, email, password });

//verification email dispatch
const token = generateToken()
sendVerificationMail(token, {name, email, userId:user._id.toString() })

res.status(201).json({ user: {id: user._id, name, email} });
};