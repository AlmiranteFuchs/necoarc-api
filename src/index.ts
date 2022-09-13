import dotenv from 'dotenv';
import { CurrentApi } from './api_models/api_services_model';
dotenv.config();
console.log(`                                     
_____                 _____         
|   | |___ ___ ___ ___|  _  |___ ___ 
| | | | -_|  _| . |___|     |  _|  _|
|_|___|___|___|___|   |__|__|_| |___|     by: AlmiranteFuchs              
`);

//#region API Express Config
const http: any = require("http");
const port: any = process.env.PORT || 3000;

import { App } from "./app";
import { baileys_api } from './api_models/baileys/api_baileys';
import { ApiServicesController } from './api_controllers/api_services_controller';

new App().server.listen(port, () => { console.log(`⚡️[Neco]: Server is running at http://localhost:${port}`); });
//#endregion APi Express Config
//export const current_api: CurrentApi = new CurrentApi(new baileys_api());
//ApiServicesController.Create_session("Sessão");
