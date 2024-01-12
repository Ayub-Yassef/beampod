import { create, generateForgotPasswordLink, sendReVerificationToken, verifyEmail } from '#/controllers/user';
import { validate } from '#/middleware/validator';
import { CreateUserSchema, EmailVerificationBody } from '#/utils/validationSchema';
import {Router} from 'express';

const router = Router();

router.post(
    '/create', validate(CreateUserSchema),create);
router.post(
    '/verify-email', validate(EmailVerificationBody), verifyEmail);
router.post(
    "/reverify-email", sendReVerificationToken)
router.post(
    "/forgot-password", generateForgotPasswordLink)
export default router;