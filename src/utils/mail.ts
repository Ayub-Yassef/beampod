import User from '#/models/user';
import EmailVerificationToken from '#/models/emailVerificationTokens';
import nodemailer from "nodemailer"
import { MAILTRAP_PASS, MAILTRAP_USER, VERIFICATION_EMAIL } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";
import path from "path";

const generateMailTransporter = () => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: MAILTRAP_USER,
            pass: MAILTRAP_PASS
        }
    });
    return transport
}

interface Profile {
    name: string;
    email: string;
    userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
    const transport = generateMailTransporter()

    const {name, email, userId} = profile
    
    const welcomeMessage = `Hello ${name}, welcome to Beampod! There are many more benefits for users that verify their accounts - use this OTP to verify yours.`
    
    transport.sendMail({
        to: email,
        from: VERIFICATION_EMAIL,
        subject: "Verify your Beampod Account",
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
}