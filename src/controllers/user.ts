import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import { RequestHandler } from "express";
import User from '#/models/user';
import { sendVerificationMail } from "#/utils/mail";
import { generateToken } from "#/utils/helper";
import emailVerificationTokens from "#/models/emailVerificationTokens";


export const create: RequestHandler = async (req: CreateUser, res) => {
const { email, password, name } = req.body;

const user = await User.create({ name, email, password });

//verification email dispatch
const token = generateToken()
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
