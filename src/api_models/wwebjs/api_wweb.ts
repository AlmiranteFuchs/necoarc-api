import { ApiServicesController } from "../../api_controllers/api_services_controller";
import { BotBehaviour, BotStep } from "../../model/bot_behaviou";
import { APISession, APISessionStatus } from "../api_model";
import WAWebJS, { Client, LocalAuth } from "whatsapp-web.js";


export class wwebjs_api implements APISession {
    _session_id: string;
    _client?: any;
    _qr_log: string | undefined;
    _status: APISessionStatus;
    _behaviour: BotBehaviour | undefined;

    // Constructor
    constructor(_session_id: string) {
        this._session_id = _session_id;
        this._qr_log = undefined;
        this._status = APISessionStatus.inactive;

        // Setup phase
        this._init_();

        // FIXME: remove this after 
        const next_step: BotStep = {
            next_steps: [],
            response: "yippie!",
            as_reply: false,
            trigger_answer: "!ping"
        }

        var first_step: BotStep = {
            next_steps: [next_step],
            response: "",
            as_reply: false,
            trigger_answer: ""
        }

        this._behaviour = new BotBehaviour(first_step, "Hum... não entendi...", "Oops... algo de errado aconteceu, sinto muito, tente novamente", "Bom, parece poggers, até", 0);
        // FIXME: remove this after 

    }

    private async _init_() {
        console.log(`⚡️[Neco]: Initializing session #${this._session_id}#...`);

        const client: Client = new Client({
            authStrategy: new LocalAuth({ clientId: this._session_id }),
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
            qrcode.generate(qr, { small: true });
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
        const next_options: BotStep[] = this._behaviour?.current_step.next_steps as BotStep[];

        const next_step: BotStep = next_options.filter((step: BotStep) => {
            return step.trigger_answer == message;
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
            }


        } else {
            // this._behaviour!.current_step = this._behaviour!.first_step;
            // msg.reply(this._behaviour!.unknown_response);
            console.log(this._behaviour!.unknown_response); // FIXME: change to send func on prod
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