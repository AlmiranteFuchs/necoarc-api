import { Request, Response, Router } from 'express';
import { home_controller } from './controllers/home';
const router: Router = Router();

//Rotas
router.get('/', home_controller.Home);

export { router };