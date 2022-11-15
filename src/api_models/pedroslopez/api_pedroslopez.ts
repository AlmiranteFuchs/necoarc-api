import {
  API,
  APIStatus,
  CommForm,
  IMessage_format,
} from "../api_services_model";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import axios from "axios";

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
  _broadcast_url: string;

  constructor(api_name?: string, save_token?: boolean, broadcast_url?: string) {
    this._status = APIStatus.inactive;
    this._api_name = api_name ?? pedroslopez_api.name;
    this._save_token = save_token ?? false;
    this._broadcast_url = broadcast_url ?? ""; // No broadcast url, send only session;
    this._qr_log = "";

    console.log(`⚡️[Neco]: Initializing ${this._api_name} API, broadcast url: ${this._broadcast_url}`);

    // Initialize the API
    setTimeout(() => {
      try {
        this.connectToWhatsApp();
      } catch (error) {
        console.log(`⚡️[Neco]: Error initializing ${this._api_name} API'`);
        this._status = APIStatus.inactive;
      }
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
      puppeteer: { headless: true },
      /*  userAgent: "Chrome", */
    });
    this._bot_client = client;

    client.on("qr", (qr: any) => {
      console.log(`⚡️[Neco]: QR RECEIVED, ${qr}`);
      this._status = APIStatus.awaiting_qr;
      this._qr_log = qr;
      qrcode.generate(qr, { small: true });
    });

    // Status
    client.on("ready", () => {
      this._status = APIStatus.active;
      console.log(`⚡️[Neco]: ${this._api_name} Client is ready! nya~`);
    });
    client.on("authenticated", () => {
      console.log(`⚡️[Neco]: ${this._api_name} AUTHENTICATED`);
    });
    client.on("auth_failure", (msg) => {
      this._status = APIStatus.inactive;
      console.error(`⚡️[Neco]: ${this._api_name} AUTHENTICATION FAILURE`, msg);
    });
    client.on("disconnected", (reason) => {
      console.log(`⚡️[Neco]: ${this._api_name} Client was logged out`, reason);
      this._status = APIStatus.inactive;
    });

    // Action Events
    client.on("message", async (msg: any) => {
      console.log(`⚡️[Neco]: ${this._api_name} Message received! nya~`);
      msg = (await this.parse_message(msg as IWaWebMessage)) as IMessage_format;

      let result: CommForm = await this.broadcast_message(msg);
      if (result.result) {
        console.log(`⚡️[Neco]: ${this._api_name} Message broadcasted! nya~`);
      }
      console.log(
        `⚡️[Neco]: ${this._api_name} Error broadcasting message! nya~ motive: ${result.message}`
      );
    });

    client.initialize();
  }

  //**# API Methods - Implementation  #**//

  // Broadcasts the message to session URL
  async broadcast_message(msg: IMessage_format): Promise<CommForm> {
    let response: CommForm = {
      result: false,
      message: "Send only session",
    };

    if (this._broadcast_url != "") {
      console.log(msg);

      await axios
        .post(this._broadcast_url, { message: msg })
        .then((res) => {
          // Check status
          if (res.status == 200) {
            response.result = true;
            response.message = "Message sent";

            return Promise.resolve(response);
          } else {
            response.result = false;
            response.message = "Error sending message, response: " + res.data;

            return Promise.resolve(response);
          }
        })
        .catch((error) => {
          response.result = false;
          response.message = "Error sending message, error: " + error;

          return Promise.resolve(response);
        });
    }
    return Promise.resolve(response);
  }

  // Sends message to given number
  async send_message(
    phone_number: string,
    text_message: string,
    reply?: boolean | undefined
  ): Promise<CommForm> {
    try {
      let msg = this._bot_client.sendMessage(
        this.format_number(phone_number),
        text_message
      );

      return Promise.resolve({
        result: true,
        message: `Message sent: ${JSON.stringify(msg)}`,
      });
    } catch (error) {
      console.log(`⚡️[Neco]: Error sending message nya!: ${error}`);
      return Promise.reject({
        result: false,
        message: `Error sending message ${error}`,
      });
    }
  }

  // Parses specific message data to interface
  async parse_message(msg: IWaWebMessage): Promise<IMessage_format> {
    let message: IMessage_format = {
      id: msg.id.id,
      from: msg.from,
      to: msg.to,
      body: msg.body,
      text: msg._data.body,
      chat_id: msg.id.remote,
      client_name: this._api_name,
      command: msg.body.split(" ")[0].split("/")[1],
      command_key_raw: msg.body.split(" ")[0],
      command_key: msg.body.split(" ")[0].split("/")[1],
      command_params: msg.body.split(" ").slice(1, 4),
      isForwarded: msg.isForwarded,
      isFrom_group: msg.author != undefined,
      // TODO: is midia
      sender_name: msg._data.notifyName,
      timestamp: msg.timestamp,
    } as IMessage_format;
    return Promise.resolve(message);
  }

  //**# Session Methods - Implementation  #**//
  // Returns QRCode of the session
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

  // Removes the session from data structure
  close_connection(): Promise<CommForm> {
    throw new Error("Method not implemented.");
  }

  //**# - Utils #**//
  private format_number(phone_number: string): string {
    // If doens't end with @c.us
    if (!phone_number.endsWith("@c.us")) {
      return phone_number + "@c.us";
    }
    return phone_number;
  }
}

// Message Interface
interface IWaWebMessage {
  _data: {
    id: {
      fromMe: boolean;
      remote: string; // 554498579172@c.us;
      id: string; // 9103F1791E8FD8EEF4;
      _serialized: string; // false_554498579172@c.us_9103F1791E8FD8EEF4
    };
    body: string; // "Hello world"
    type: string; // chat;
    t: number; // 1668313468;
    notifyName: string; // Almirante Fuchs;
    from: string; // 554498579172@c.us;
    to: string; // 5541936180244@c.us;
    self: string; // in;
    ack: number; //  1;
    isNewMsg: boolean; //  true;
    star: boolean; // false;
    kicNotified: boolean; // false;
    recvFresh: boolean; // true;
    isFromTemplate: boolean; // false;
    thumbnail: string; // "";
    pollInvalidated: boolean; // false;
    latestEditMsgKey: any; // null;
    latestEditSenderTimestampMs: any; // null;
    broadcast: boolean; // false;
    mentionedJidList: any[]; // [];
    isVcardOverMmsDocument: boolean; // false;
    hasReaction: boolean; // false;
    ephemeralDuration: number; // 0;
    ephemeralSettingTimestamp: number; // 0;
    ephemeralOutOfSync: boolean; // false;
    disappearingModeInitiator: string; // chat;
    productHeaderImageRejected: boolean; // false;
    lastPlaybackProgress: number; // 0;
    isDynamicReplyButtonsMsg: boolean; // false;
    isMdHistoryMsg: boolean; // false;
    stickerSentTs: number; // 0;
    isAvatar: boolean; // false;
    requiresDirectConnection: boolean; // false;
    pttForwardedFeaturesEnabled: true;
    isEphemeral: boolean; // false;
    isStatusV3: boolean; // false;
    links: any[]; // [];
  };
  mediaKey: any; // undefined;
  id: {
    fromMe: false;
    remote: string; // 554498579172@c.us;
    id: string; // 9103F1791E8FD8EEF4;
    _serialized: string; // false_554498579172@c.us_9103F1791E8FD8EEF4
  };
  ack: number; // 1;
  hasMedia: boolean; // false;
  body: string; // aa;
  type: string; // chat;
  timestamp: number; // 1668313468;
  from: string; // 554498579172@c.us;
  to: string; // 5541936180244@c.us;
  author: any; //undefined;
  deviceType: string; // web;
  isForwarded: any; // undefined;
  forwardingScore: number; // 0;
  isStatus: boolean; // false;
  isStarred: boolean; // false;
  broadcast: boolean; // false;
  fromMe: boolean; // false;
  hasQuotedMsg: boolean; // false;
  duration: any; // undefined;
  location: any; // undefined;
  vCards: any[]; // [];
  inviteV4: any; // undefined;
  mentionedIds: any[]; // [];
  orderId: any; // undefined;
  token: any; // undefined;
  isGif: boolean; // false;
  isEphemeral: boolean; // false;
  links: any[]; // []
}
