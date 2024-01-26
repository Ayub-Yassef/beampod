import { create, generateForgotPasswordLink, grantValid, sendReVerificationToken, signIn, updatePassword, verifyEmail } from '#/controllers/user';
import { isValidPassResetToken } from '#/middleware/auth';
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
router.get('/is-auth', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.split("Bearer ")[1];
    if (!token) return res.status(403).json({ error: "Unauthorised request."});

    const payload = verify(token, JWT_SECRET) as JwtPayload;
    const id = payload.userId;

    const user = await User.findById(id);
    if (!user) return res.status(403).json({ error: "Unauthorised request" });

    res.json({
        profile: {
            id: user._id,
            name: user.name,
            email: user.email,
            verified: user.verified,
            avatar: user.avatar?.url,
            followers: user.followers.length,
            following: user.following.length,
        },
    });
});

export default router;