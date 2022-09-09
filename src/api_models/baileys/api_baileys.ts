import { API, APIStatus, CommForm } from "../api_services_model";
import dotenv from 'dotenv';
import { ApiServicesController } from "../../api_controllers/api_services_controller";
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys';
import { Boom } from '@hapi/boom'
import rimraf from "rimraf";

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
        this._clear_session();

        // Initialize the API
        setTimeout(() => {
            this.connectToWhatsApp();
        }, 1000);
    }

    // This initializes an instance of the API, the "client" of it, does not save the token
    async connectToWhatsApp() {
        try {
            // If there is a token, delete it

            const { state, saveCreds } = await useMultiFileAuthState(`auth_info_baileys/${this._api_name as string}`);
            const sock = makeWASocket({
                // can provide additional config here
                auth: state,
                printQRInTerminal: false
            } as any);

            this._bot_client = sock;

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect } = update
                if (connection === 'close') {
                    this._status = APIStatus.inactive;
                    const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

                    // reconnect if not logged out
                    if (shouldReconnect) {
                        console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
                        this.connectToWhatsApp();
                    } else {
                        console.log('connection closed due to ', lastDisconnect?.error, ', closing session ', shouldReconnect);
                        this.close_connection(lastDisconnect?.error);
                    }
                } else if (connection === 'open') {
                    this._status = APIStatus.active;
                }
                if (update.qr) {
                    this._qr_log = update.qr;
                    this._status = APIStatus.awaiting_qr;
                }
            })

            return true;
        } catch (error) {
            console.log(error);
            return false;
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

            await this._bot_client.ws.terminate();
            await this._bot_client.ws.close();
            this._clear_session();
            console.log(`\n[${this._api_name}]: Closed connection\n`);

            return { result: true, message: "Conexão encerrada com sucesso" };
        } catch (error) {
            console.log(`\n[${this._api_name}]: Error closing connection: ${error}\n`);
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
            rimraf(`auth_info_baileys/${this._api_name as string}`, (err) => {
                if (err) {
                    console.log(`\n[${this._api_name}]: Error deleting token file: ${err}\n`);
                    return false;
                }
            });
            console.log(`\n[${this._api_name}]: Deleted token file\n`);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}