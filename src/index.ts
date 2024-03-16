import dotenv from 'dotenv';
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
import { ApiServicesController } from './api_controllers/api_services_controller';
import { ApiSessions } from './api_models/api_model';
import { wwebjs_api } from './api_models/wwebjs/api_wweb';

new App().server.listen(port, () => { console.log(`⚡️[Neco]: Server is running at http://localhost:${port}`); });
//#endregion APi Express Config

// Test
// const test_api:ApiSessions = new ApiSessions(new wwebjs_api("1"));