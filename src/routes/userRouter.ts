import {Router} from 'express';
import { UserController } from '../controller/UserController';

const userRouter = Router();

userRouter.get("/users", UserController.all);

userRouter.get("/users/:id", UserController.findOne);

userRouter.post("/users", UserController.create);

userRouter.put("/users/:id", UserController.update);

userRouter.delete("/users/:id", UserController.delete);
export default userRouter;