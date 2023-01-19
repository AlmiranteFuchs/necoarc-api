import dotenv from 'dotenv';
import { Router } from 'express';
import { home_controller } from './routes_controllers/home';
import { private_controller } from './routes_controllers/private';
import { createAuthorizationMiddleware } from "./middleware";
import { operations_controller } from './routes_controllers/operations';
import { session_controller } from './routes_controllers/sessionController';

dotenv.config();

const secret: string = process.env.auth_secret as string;
const router: Router = Router();

//Rotas
router.get('/', home_controller.Home);
router.get('/private/:session_name', createAuthorizationMiddleware(secret), private_controller.Private);                                              // Test Route
router.post('/create_session/:session_name', createAuthorizationMiddleware(secret), session_controller.Create)                                         // Create Session 
router.get('/get_QR/:session_name', createAuthorizationMiddleware(secret), session_controller.GetQR)                                                  // QR 
router.get('/status/:session_name', createAuthorizationMiddleware(secret), session_controller.Status)                                                   // Session Status 

// Op Routes
router.post('/send_simple_message/:session_name', createAuthorizationMiddleware(secret), operations_controller.Send)                         // Message 
router.get('/get_group_participants/:session_name/:group_id', createAuthorizationMiddleware(secret), operations_controller.GetGroupParticipants)   // Get Participants
export { router };