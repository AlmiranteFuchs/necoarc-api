import dotenv from 'dotenv';
import { Router } from 'express';
import { home_controller } from './routes_controllers/home';
import { private_controller } from './routes_controllers/private';
import { createAuthorizationMiddleware } from "./middleware";
import { send_simple_message_controller } from './routes_controllers/send_simple_message';

dotenv.config();

const secret:string = process.env.auth_secret as string;
const router: Router = Router();

//Rotas
router.get('/', home_controller.Home);
router.get('/private', createAuthorizationMiddleware(secret), private_controller.Private);                                              // Test Route
router.post('/send_simple_message', createAuthorizationMiddleware(secret), send_simple_message_controller.Send)                         // Message 

export { router };