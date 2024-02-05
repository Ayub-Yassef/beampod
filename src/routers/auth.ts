import { create, generateForgotPasswordLink, grantValid, sendReVerificationToken, signIn, updatePassword, verifyEmail } from '#/controllers/user';
import { isValidPassResetToken, mustAuth } from '#/middleware/auth';
import { validate } from '#/middleware/validator';
import User from '#/models/user';
import { CreateUserSchema, SignInValidationSchema, TokenAndIdValidation, UpdatePasswordSchema } from '#/utils/validationSchema';
import { JWT_SECRET } from '#/utils/variables';
import { Router } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

const router = Router();

router.post(
    '/create', validate(CreateUserSchema),create);
router.post(
    '/verify-email', validate(TokenAndIdValidation), verifyEmail);
router.post(
    "/reverify-email", sendReVerificationToken)
router.post(
    "/forgot-password", generateForgotPasswordLink)
router.post (
    "/verify-pass-reset-token", validate(TokenAndIdValidation), isValidPassResetToken, grantValid);
router.post(
    '/update-password', validate(UpdatePasswordSchema), isValidPassResetToken, updatePassword)
router.post(
    '/sign-in', validate(SignInValidationSchema), signIn)
router.get('/is-auth', mustAuth, (req, res) => {
    res.json({
        profile: req.user,
    });
});
router.get('/public', (req, res) => {
    res.json({
        message: "ATTENTION! You are using a PUBLIC route.",
    });
});
router.get('/private', mustAuth, (req, res) => {
    res.json({
        message: "ATTENTION! You are using a PRIVATE route.",
    });
});

import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

router.post("/update-profile", async(req, res) => {
    if (!req.headers["content-type"]?.startsWith("multipart/form-data;"))
    return res.status(422).json({ error: "Only accepts form-data."});
    const dir = path.join(__dirname, "../public/profiles");
    try {
        await fs.readdirSync(dir)
    } catch (error) {
        await fs.mkdirSync(dir)
    }
    
    const form = formidable({
        uploadDir: dir,
        filename(name, ext, part, form) {
            return Date.now() + "_" + part.originalFilename
        },
    });
    form.parse(req, (err, fields, files) => {
        //console.log("fields: ", fields);
        //console.log("files: ", files);

        res.json({ uploaded: true });
    });
});

export default router;