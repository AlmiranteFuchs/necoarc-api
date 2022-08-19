import { API } from "./api_services_model";

export class whatsapp_web_js implements API {
    //TODO: Implement try and catch --> switch API runtime?
    /*
    *   # First API
    *   # pedroslopez/whatsapp-web.js/
    */

    _api_name?: string;
    _bot_client: any;

    constructor(api_name?: string) {
        this._api_name = api_name ?? whatsapp_web_js.name;
        console.log(`⚡️[Neco]: Initializing ${this._api_name} API'`);

        const { Client } = require('whatsapp-web.js');
        this._bot_client = new Client();
        this._bot_client.initialize();

        this._bot_client.on('qr', (qr: any) => {
            // Generate and scan this code with your phone
            console.log('QR RECEIVED', qr);
        });

    }


    send_message(phone_number: string, text_message: string): boolean {
        throw new Error("Method not implemented.");
    }

}