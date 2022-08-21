import { API } from "../api_services_model";

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

        this._bot_client.on('ready', () => { console.log(`⚡️[${this._api_name}]: Client is ready!`); });                    //  Initialized Event

        this._bot_client.on('message', (message: any) => {                                                                   //  On message Event
            if (message.body.startsWith("/")) {
                console.log(`⚡️[${this._api_name}]: New message: From: ${message.from} On: ${message.to} Chat`);
                message.reply("Tentando um comando!");
            }
        });


        this._bot_client.initialize();                                                                                       //  Initialize
    }


    send_message(phone_number: string, text_message: string): boolean {
        throw new Error("Method not implemented.");
    }

}