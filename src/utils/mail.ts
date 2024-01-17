import User from '#/models/user';
import EmailVerificationToken from '#/models/emailVerificationTokens';
import nodemailer from "nodemailer"
import { MAILTRAP_PASS, MAILTRAP_USER, SIGN_IN_URL, VERIFICATION_EMAIL } from "#/utils/variables";
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

interface Options {
    email: string;
    link: string;
}

export const sendForgotPasswordLink = async (options: Options) => {
    const transport = generateMailTransporter()

    const { email, link } = options;
    
    const message = "Hello, Please use the link below to reset your forgotten password. If you did not make this request, please get in touch so we may secure your account."
    transport.sendMail({
        to: email,
        from: VERIFICATION_EMAIL,
        subject: "Password Reset",
        html: generateTemplate({
            title: "Forgotten Password",
            message,
            logo: "cid:logo",
            banner: "cid:forgot_password",
            link,
            btnTitle: "Reset Password"
        }),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../mail/logo.png"),
                cid: "logo"
            },
            {
                filename: "forgotPassword.png",
                path: path.join(__dirname, "../mail/forgotPassword.png"),
                cid: "forgot_password"
            }
        ]
    });
}
export const sendPassResetSuccessEmail = async (name: string, email: string) => {
    const transport = generateMailTransporter()
    
    const message = `Dear ${name}, We just updated your password successfully.`
    transport.sendMail({
        to: email,
        from: VERIFICATION_EMAIL,
        subject: "New Password Updated",
        html: generateTemplate({
            title: "New Password Updated",
            message,
            logo: "cid:logo",
            banner: "cid:forgot_password",
            link: SIGN_IN_URL,
            btnTitle: "Log In With New Password"
        }),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../mail/logo.png"),
                cid: "logo"
            },
            {
                filename: "forgotPassword.png",
                path: path.join(__dirname, "../mail/forgotPassword.png"),
                cid: "forgot_password"
            }
        ]
    });
}