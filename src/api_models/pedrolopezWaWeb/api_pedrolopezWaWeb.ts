import { API, CommForm } from "../api_services_model";
import dotenv from 'dotenv';
import axios from "axios";
import { ApiServicesController, APIS_TYPES } from "../../api_controllers/api_services_controller";

dotenv.config();

export class whatsapp_web_js implements API {
    //TODO: Implement try and catch --> switch API runtime?
    /*
    *   # First API
    *   # pedroslopez/whatsapp-web.js/
    */

    _api_name?: string;
    _bot_client: any;
    _active: boolean;

    constructor(api_name?: string) {
        this._active = false;
        this._api_name = api_name ?? whatsapp_web_js.name;
        console.log(`⚡️[Neco]: Initializing ${this._api_name} API'`);

        //API CONFIG
        const { Client, LocalAuth } = require('whatsapp-web.js');
        const qrcode = require('qrcode-terminal');
        //Api Object
        this._bot_client = new Client({
            authStrategy: new LocalAuth({ clientId: this._api_name })
        });

        //API FUNCTIONS

        this._bot_client.on('qr', (qr: any) => {                                                                             //  QRCode Event
            console.log(`⚡️[${this._api_name}]: Not connected... Scan below! `);
            setTimeout(() => { qrcode.generate(qr, { small: true }); }, 3000);
        });
        this._bot_client.on('authenticated', (session: any) => { console.log(`⚡️[${this._api_name}]: Logged!!`); });
        this._bot_client.on('ready', () => { console.log(`⚡️[${this._api_name}]: Client is ready!`); this._active = true; });//  Initialized Event

        this._bot_client.on('message', (message: any) => {                                                                   //  On message Event
            if (message.body.startsWith("/")) {
                console.log(`⚡️[${this._api_name}]: New message: From: ${message.from} On: ${message.to} Chat`);
                ApiServicesController.Propagate_message(APIS_TYPES.whatsapp_web_js, message);
            }
        });
        this._bot_client.initialize();                                                                                       //  Initialize
    }

    async send_message(phone_number: string, text_message: string, reply?: boolean): Promise<CommForm> {
        if (!this._active) { return { result: false, message: "Error, API não iniciada" } };
        try {
            await this._bot_client.sendMessage(phone_number, text_message);
            return { result: true, message: "Mensagem enviada com sucesso" };
        } catch (error) {
            console.log(`⚡️[${this._api_name}]: Error, could not send message: \n ${error}`);
            return { result: false, message: `Não foi possível enviar: ${error}` };
        }
    }

}