import { create, generateForgotPasswordLink, grantValid, sendProfile, sendReVerificationToken, signIn, updatePassword, updateProfile, verifyEmail } from '#/controllers/user';
import { isValidPassResetToken, mustAuth } from '#/middleware/auth';
import { validate } from '#/middleware/validator';
import { CreateUserSchema, SignInValidationSchema, TokenAndIdValidation, UpdatePasswordSchema } from '#/utils/validationSchema';
import { Router } from 'express';
import fileParser, { RequestWithFiles } from '#/middleware/fileParser';

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
router.get('/is-auth', mustAuth, sendProfile);

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

router.post("/update-profile", mustAuth, fileParser, updateProfile);

export default router;