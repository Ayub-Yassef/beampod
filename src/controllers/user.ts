import { CreateUser } from "#/@types/user";
import { RequestHandler } from "express";
import User from '#/models/user';
import EmailVerificationToken from '#/models/emailVerificationTokens';
import nodemailer from "nodemailer"
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";
import path from "path";

export const create: RequestHandler = (async (req: CreateUser, res) => {
const { email, password, name } = req.body;

const user = await User.create({ name, email, password });

//verification email dispatch

res.status(201).json({ user });
});