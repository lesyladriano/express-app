import {Router} from 'express';

import { AuthController } from '../controller/authController';
import { authSchema } from '../validation/authSchema';
import { validateRequest } from '../middleware/validateRequest';

const authRouter = Router();
authRouter.post("/register", authSchema, validateRequest, AuthController.create); //auth/register

authRouter.post("/login", AuthController.login); //auth/login


export default authRouter;