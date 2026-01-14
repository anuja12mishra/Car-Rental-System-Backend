import { Router } from "express";
import {SignIn, SignUp} from '../controllers/user'

const AuthRouter = Router();
AuthRouter.post('/signin',SignIn);
AuthRouter.post('signup',SignUp)

export default AuthRouter;