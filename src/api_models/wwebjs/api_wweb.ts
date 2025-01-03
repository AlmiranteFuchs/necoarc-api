import {ApiServicesController} from "../../api_controllers/api_services_controller";
import {BotBehaviour, BotStep} from "../../model/bot_behaviour";
import {APISession, APISessionStatus} from "../api_model";
import WAWebJS, {Client, LocalAuth} from "whatsapp-web.js";
import {createBotBehaviourFromJson} from "../../api_controllers/bot_behaviour_parser";

enum SessionMessageStatus {
    IDLE,
    AWAITING_RESPONSE
}

export class wwebjs_api implements APISession {
    _session_id: string;
    _client?: any;
    _qr_log: string | undefined;
    _status: APISessionStatus;
    _behaviour: BotBehaviour | undefined;
    _messageStatus: SessionMessageStatus;

    // Constructor
    constructor(_session_id: string) {
        this._session_id = _session_id;
        this._qr_log = undefined;
        this._status = APISessionStatus.inactive;
        this._messageStatus = SessionMessageStatus.IDLE;

        // Setup phase
        this._init_();

        this._behaviour = createBotBehaviourFromJson('../../db/bots_behaviours/session1.json');
    }

    private async _init_() {
        console.log(`⚡️[Neco]: Initializing session #${this._session_id}#...`);

        const client: Client = new Client({
            authStrategy: new LocalAuth({clientId: this._session_id}),
            puppeteer: {
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
            qrcode.generate(qr, {small: true});
            // DEBUG

        });

        client.on('authenticated', () => {
            console.log(`⚡️[Neco]: Session ${this._session_id} is authenticated`);
            this._status = APISessionStatus.active;
            this._client = client;
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

        client.on('message', msg => {

        });

        // FIXME: Remove this prod
        client.on('message_create', msg => {
            this._message_behaviour(msg);
        });

    }

    private _message_behaviour(msg: WAWebJS.Message) {
        const message: string = msg.body;


        switch (this._messageStatus) {
            case SessionMessageStatus.IDLE:
                if (message == this._behaviour?.first_step.trigger_answer) {
                    this._send_message(msg, this._behaviour!.first_step.response, msg.from, true);
                    this._messageStatus = SessionMessageStatus.AWAITING_RESPONSE;
                } else {
                    // TODO: If dedicated say what
                }
                break;

            case SessionMessageStatus.AWAITING_RESPONSE:
                const next_options: BotStep[] = this._behaviour?.current_step.next_steps as BotStep[];

                const next_step: BotStep = next_options.filter((step: BotStep) => {
                    return step.trigger_answer == message || step.trigger_answer == "";
                })[0];

                if (next_step) {
                    // Goes to next setp
                    this._behaviour!.current_step = next_step;

                    // Sends message
                    this._send_message(msg, this._behaviour!.current_step.response, msg.from, this._behaviour!.current_step.as_reply);

                    // If no more steps ahead
                    if (next_step.next_steps.length == 0) {
                        this._send_message(msg, this._behaviour!.goodbye_message, msg.from);
                        this._behaviour!.current_step = this._behaviour!.first_step;
                        this._messageStatus = SessionMessageStatus.IDLE;
                    }

                } else {
                    // this._behaviour!.current_step = this._behaviour!.first_step;
                    // msg.reply(this._behaviour!.unknown_response);
                    console.log(this._behaviour!.unknown_response); // FIXME: change to send func on prod
                }
                break;
        }
    }

    private _send_message(msg: WAWebJS.Message, message: string, chat_id: string, reply: boolean = false) {
        if (reply) {
            // If reply we don't need the chat_id only the msg
            msg.reply(message);
            return;
        }

        this._client.sendMessage(chat_id, message);
    }
}