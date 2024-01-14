import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import { RequestHandler } from "express";
import User from '#/models/user';
import { sendForgotPasswordLink, sendVerificationMail } from "#/utils/mail";
import { generateToken } from "#/utils/helper";
import emailVerificationTokens from "#/models/emailVerificationTokens";
import passwordResetToken from "#/models/passwordResetToken";
import { isValidObjectId } from "mongoose";
import crypto from 'crypto';
import { PASSWORD_RESET_LINK } from "#/utils/variables";


export const create: RequestHandler = async (req: CreateUser, res) => {
const { email, password, name } = req.body;

const user = await User.create({ name, email, password });

//verification email dispatch
const token = generateToken()
await emailVerificationTokens.create({
    owner: user._id,
    token,
})

sendVerificationMail(token, {name, email, userId:user._id.toString() })

res.status(201).json({ user: {id: user._id, name, email} });
};

export const verifyEmail: RequestHandler = async (req: VerifyEmailRequest, res) => {
const { token, userId } = req.body;

const verificationToken = await emailVerificationTokens.findOne({
    owner: userId
});

if(!verificationToken) return res.status(403).json({error: "Invalid token!"})

const matched = await verificationToken.compareToken(token)
if(!matched) return res.status(403).json({error: "Invalid token!"})

await User.findByIdAndUpdate(userId, {
    verified: true
});
await emailVerificationTokens.findByIdAndDelete(verificationToken._id)

res.json({message: "Your email is verified."})
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
const { userId } = req.body;

if(!isValidObjectId(userId)) return res.status(403).json({error: "Invalid request!"})

const user = await User.findById(userId)
if(!user) return res.status(403).json({error: "Invalid request!"})

await emailVerificationTokens.findOneAndDelete({
    owner: userId
})

const token = generateToken()
await emailVerificationTokens.create({
    owner: userId,
    token
})

sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString()
});

res.json({message: "Please check your inbox."})
};
export const generateForgotPasswordLink: RequestHandler = async (req, res) => {
const { email } = req.body;

const user = await User.findOne({email})
if(!user) return res.status(404).json({error: "Account not found!"})

//generate link
// https://yourapp.com/reset-password?token=dafdsagh214432df&userId=67fjksahf42

await passwordResetToken.findOneAndDelete({
    owner: user._id,
})

const token = crypto.randomBytes(36).toString('hex')

await passwordResetToken.create({
    owner: user._id,
    token
})
const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`

sendForgotPasswordLink({email: user.email, link: resetLink})

res.json({ message: "We have sent password reset instructions to your registered email." });
};
