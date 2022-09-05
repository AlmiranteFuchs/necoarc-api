import { API, APIStatus, CommForm } from "../api_services_model";
import dotenv from 'dotenv';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys';
import { Boom } from '@hapi/boom';
import { ApiServicesController } from "../../api_controllers/api_services_controller";

dotenv.config();

export class baileys_api implements API {

    /*
     * # Secound API
     * # adiwajshing/Baileys
     */

    _api_name?: string | undefined;
    _bot_client: any;
    _save_token?: boolean;
    _qr_log: string;
    _status: APIStatus;

    constructor(api_name?: string, save_token?: boolean) {
        this._status = APIStatus.inactive;
        this._api_name = api_name ?? baileys_api.name;
        this._save_token = save_token ?? false;
        this._qr_log = "";

        console.log(`⚡️[Neco]: Initializing ${this._api_name} API'`);

        // Clear session if not saving token
        if (!this._save_token) { this._clear_session(); }

        // API CONFIG
        setTimeout(() => {
            this.connectToWhatsApp();
        }, 3000);
    }

    // This initializes an instance of the API, the "client" of it
    async connectToWhatsApp() {
        try {
            const { state, saveCreds } = await useMultiFileAuthState(`auth_info_baileys/${this._api_name as string}`);

            const sock = makeWASocket({
                printQRInTerminal: true,
                auth: state,
            } as any);

            // Defines 
            this._bot_client = sock;

            // Log Update
            sock.ev.on('creds.update', saveCreds);

            // Conn update Event
            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;

                if (update.qr) {
                    this._qr_log = update.qr;
                    this._status = APIStatus.awaiting_qr;
                }

                if (connection === 'close') {
                    this._status = APIStatus.inactive;

                    // Disconnet if logged out
                    if ((lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.loggedOut || DisconnectReason.timedOut) { await this.close_connection((lastDisconnect?.error as Boom)?.output?.statusCode); }

                    console.log(`\n[${this._api_name}]: `, 'Connection closed due to ', lastDisconnect?.error, ', disconnecting \n');
                    this.close_connection(lastDisconnect?.error);

                    // Reconnect if not logged out
                    /* this.connectToWhatsApp(); */

                } else if (connection === 'open') {
                    console.log(`\n\n # [${this._api_name}]: Opened connection # \n\n`);
                    this._status = APIStatus.active;
                }
            });

            // On Message Event
            sock.ev.on('messages.upsert', async m => {
            });
        } catch (error) {
            console.log(error);
        }
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

        if (this._status < 1 && !this._save_token) {
            return { result: false, message: "Não é possivel resgatar QR, serviço não iniciado" };
        }

        let timeout = 3000;
        let interval = 200;

        let qr: string = "";
        while (!qr) {
            if (timeout <= 0) { return { result: false, message: "timeout" }; }
            qr = this._get_qr();
            await sleep(interval);
            timeout -= interval;
        }

        return { result: true, message: qr };
    }


    async close_connection(motive?: any): Promise<CommForm> {
        try {
            console.log(`\n\n # [${this._api_name}]: Closing connection due: ${motive} # \n\n`);
            ApiServicesController.Remove_session(this._api_name as string);

            await this._bot_client.logout();
            await this._clear_session();
            console.log(`\n[${this._api_name}]: Closed connection\n`);

            return { result: true, message: "Conexão encerrada com sucesso" };
        } catch (error) {
            return { result: false, message: `Não foi possível encerrar conexão corretamente: ${error}` };
        }
    }

    // Getters && private methods
    private _get_qr(): string {
        return this._qr_log;
    }

    private async _clear_session(): Promise<boolean> {
        // Forces the deletion of the token file
        try {
            const rimraf = require("rimraf");
            await rimraf(`auth_info_baileys/${this._api_name as string}`, function () { console.log("\nCleared cache\n"); });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}