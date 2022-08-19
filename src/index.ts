import dotenv from 'dotenv';
import { whatsapp_web_js } from './api_models/api_pedrolopezWaWeb';
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

export const current_api: CurrentApi = new CurrentApi(new whatsapp_web_js());

import { App } from "./app";

new App().server.listen(port, () => { console.log(`⚡️[Neco]: Server is running at http://localhost:${port} Nya~`); });
//#endregion APi Express Config