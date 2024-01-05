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
var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: MAILTRAP_USER,
        pass: MAILTRAP_PASS
    }
});


const token = generateToken();
const newToken = await EmailVerificationToken.create({
    owner: user._id,
    token
});

const welcomeMessage = `Hello ${name}, welcome to Beampod! There are many more benefits for users that verify their accounts - use this OTP to verify yours.`

transport.sendMail({
    to: user.email,
    from: "no-reply@beampod.com",
    html: generateTemplate({
        title: "Welcome to Beampod!",
        message: welcomeMessage,
        logo: "cid:logo",
        banner: "cid:welcome",
        link: "#",
        btnTitle: token
    }),
    attachments: [
        {
            filename: "logo.png",
            path: path.join(__dirname, "../mail/logo.png"),
            cid: "logo"
        },
        {
            filename: "welcome.png",
            path: path.join(__dirname, "../mail/welcome.png"),
            cid: "welcome"
        }
    ]
});
res.status(201).json({ user });
});