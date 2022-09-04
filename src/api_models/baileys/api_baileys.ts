import { API, CommForm } from "../api_services_model";
import dotenv from 'dotenv';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys';
import { Boom } from '@hapi/boom';

dotenv.config();

export class baileys_api implements API {

    /*
     * # Secound API
     * # adiwajshing/Baileys
     */

    _api_name?: string | undefined;
    _bot_client: any;
    _active: boolean;
    _save_token?: boolean;
    _qr_log: string;

    constructor(api_name?: string, save_token?: boolean) {
        this._active = false;
        this._api_name = api_name ?? baileys_api.name;
        this._save_token = save_token ?? false;
        this._qr_log = "";

        console.log(`⚡️[Neco]: Initializing ${this._api_name} API'`);

        // API CONFIG
        this.connectToWhatsApp();
    }

    // This initializes an instance of the API, the "client" of it
    async connectToWhatsApp() {

        // Forces the deletion of the token file
        if (this._save_token) {
            try {
                var rimraf = require("rimraf");
                rimraf.sync("auth_info_baileys");
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        }

        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

        const sock = makeWASocket({
            printQRInTerminal: true,
            auth: state,
        } as any);

        // Defines 
        this._bot_client = sock;

        // Log Update
        sock.ev.on('creds.update', saveCreds);

        // Conn update Event
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;

            if (update.qr) {
                this._qr_log = update.qr;
            }

            if (connection === 'close') {
                this._active = false;
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log(`[${this._api_name}]: `, 'connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
                // reconnect if not logged out
                if (shouldReconnect) {
                    this.connectToWhatsApp();
                }
            } else if (connection === 'open') {
                console.log(`\n\n # [${this._api_name}]: Opened connection # \n\n`);
                this._active = true;
                return true;
            }
        });

        // On Message Event
        sock.ev.on('messages.upsert', async m => {
            //console.log(`[${this._api_name}]: `, JSON.stringify(m, undefined, 2));
        });
    }


    async send_message(phone_number: string, text_message: string, reply?: boolean | undefined): Promise<CommForm> {
        try {
            await this._bot_client.sendMessage(`${phone_number}@s.whatsapp.net`, { text: text_message });
            return { result: true, message: "Mensagem enviada com sucesso" };
        } catch (error) {
            console.log(`⚡️[${this._api_name}]: Error, could not send message: \n ${error}`);
            return { result: false, message: `Não foi possível enviar: ${error}` };
        }
    }

    async get_qrCode(): Promise<CommForm> {
        //Auxiliar wait
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        if (!this._active && !this._save_token) {
            return { result: false, message: "Não é possivel resgatar QR, serviço não iniciado" };
        }
        
        setTimeout(() => {
            return { result: false, message: "timeout" };
        }, 3000);

        let qr: string = "";
        while (!qr) {
            qr = this._get_qr();
            await sleep(200);
        }

        return { result: true, message: qr };
    }


    async close_connection(): Promise<CommForm> {
        throw new Error("Method not implemented.");
    }

    // Getters
    private _get_qr(): string {
        return this._qr_log;
    }
}