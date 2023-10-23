import {Router} from 'express';

import { AuthController } from '../controller/authController';
import { authSchema } from '../validation/authSchema';
import { validateRequest } from '../middleware/validateRequest';
import { validateJwt } from '../middleware/validateJwt';

const authRouter = Router();
authRouter.post("/register", authSchema, validateRequest, AuthController.create); //auth/register

authRouter.post("/login", AuthController.login); //auth/login
authRouter.post("/logout", AuthController.logout); //auth/logout
authRouter.put("/change-password", validateJwt, AuthController.changePassword); //auth/change-password
authRouter.post("/sent-reset-password", AuthController.passwordResetEmail); //auth/change-password

export default authRouter;