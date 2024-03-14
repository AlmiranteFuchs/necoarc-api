import { ApiServicesController } from "../../api_controllers/api_services_controller";
import { APISession, APISessionStatus } from "../api_model";
import { Client, LocalAuth } from "whatsapp-web.js";


export class wwebjs_api implements APISession {
    _session_id: string;
    _client?: any;
    _qr_log: string | undefined;
    _status: APISessionStatus;

    // Constructor
    constructor(_session_id: string) {
        this._session_id = _session_id;
        this._qr_log = undefined;
        this._status = APISessionStatus.inactive;

        // Setup phase
        this._init_();
    }

    private async _init_() {
        console.log(`⚡️[Neco]: Initializing session #${this._session_id}#...`);

        const client: Client = new Client({
            authStrategy: new LocalAuth({ clientId: this._session_id }),
                puppeteer: {
                    // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
                headless: true
            }
        });

        client.initialize();


        client.on('qr', (qr) => {
            // NOTE: This event will not be fired if a session is specified.
            console.log('QR RECEIVED', qr);
            this._qr_log = qr;
            this._status = APISessionStatus.awaiting_qr;

            // DEBUG
            var qrcode = require('qrcode-terminal');
            qrcode.generate(qr, { small: true });
            // DEBUG

        });

        client.on('authenticated', () => {
            console.log(`⚡️[Neco]: Session ${this._session_id} is authenticated`);
            this._status = APISessionStatus.active;
        });

        client.on('auth_failure', msg => {
            // Fired if session restore was unsuccessful
            console.error(`⚡️[Neco]: Session ${this._session_id} failed to authenticate`);
            this._status = APISessionStatus.failed;
            
            ApiServicesController.Remove_session(this._session_id);                             // TODO: retry
        });

        client.on('ready', () => {
            this._status = APISessionStatus.active;
        });

        client.on('disconnected', (reason) => {
            console.log(`⚡️[Neco]: Session ${this._session_id} disconnected`);
            this._status = APISessionStatus.inactive;

            ApiServicesController.Remove_session(this._session_id);
        });

    }
}