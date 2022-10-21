import {
  API,
  APIStatus,
  CommForm,
  IMessage_format,
} from "../api_services_model";
import { Client, LocalAuth } from "whatsapp-web.js";

import qrcode from "qrcode-terminal";

export class pedroslopez_api implements API {
  /*
   * # First API
   * # pedroslopez/whatsapp-web.js
   */

  _api_name?: string | undefined;
  _bot_client: any;
  _save_token?: boolean;
  _qr_log: string;
  _status: APIStatus;

  constructor(api_name?: string, save_token?: boolean) {
    this._status = APIStatus.inactive;
    this._api_name = api_name ?? pedroslopez_api.name;
    this._save_token = save_token ?? false;
    this._qr_log = "";

    console.log(`⚡️[Neco]: Initializing ${this._api_name} API'`);
    /* this._clear_session(); */

    // Initialize the API
    setTimeout(() => {
      this.connectToWhatsApp();
    }, 1000);

    // Clean the session after use
    /*  setTimeout(() => {
      this.close_connection("Auto timeout");
    }, 200000); */
  }

  // This initializes an instance of the API, the "client" of it, does not save the token
  async connectToWhatsApp() {
    const client = new Client({
      authStrategy: new LocalAuth({ clientId: this._api_name }),
      puppeteer: { headless: false, executablePath: 'C:/Program Files/MozillaFirefox/firefox.exe', args: ['--no-sandbox'] },
      /*  userAgent: "Chrome", */
    });
    this._bot_client = client;

    client.on("qr", (qr: any) => {
      console.log(`⚡️[Neco]: QR RECEIVED, ${qr}`);
      this._status = APIStatus.awaiting_qr;
      this._qr_log = qr;
      qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
      this._status = APIStatus.active;
      console.log(`⚡️[Neco]: Client is ready! nya~`);
    });
    client.on("authenticated", () => {
      console.log("⚡️[Neco]: AUTHENTICATED");
    });
    client.on("auth_failure", (msg) => {
      // Fired if session restore was unsuccessful
      console.error("⚡️[Neco]: AUTHENTICATION FAILURE", msg);
    });

    client.on("message_ack", function (msg: any) {
      console.log(`⚡️[Neco]: Message received! nya~`);
      console.log(msg);
    });
    client.on("message", function (msg: any) {
      console.log(`⚡️[Neco]: Message received! nya~`);
      console.log(msg);
    });
    client.on("message_create", (msg) => {
      console.log(`⚡️[Neco]: Message received! nya~`);
      console.log(msg);
    });

    client.on("disconnected", (reason) => {
      console.log("⚡️[Neco]: Client was logged out", reason);
      this._status = APIStatus.inactive;
    });

    client.initialize();
  }

  send_message(
    phone_number: string,
    text_message: string,
    reply?: boolean | undefined
  ): Promise<CommForm> {
    throw new Error("Method not implemented.");
  }
  get_qrCode(): Promise<CommForm> {
    if (this._status == APIStatus.awaiting_qr) {
      return Promise.resolve({
        result: true,
        message: this._qr_log,
      });
    }
    return Promise.reject({
      result: false,
      message: this._qr_log,
    });
  }
  close_connection(): Promise<CommForm> {
    throw new Error("Method not implemented.");
  }
}
