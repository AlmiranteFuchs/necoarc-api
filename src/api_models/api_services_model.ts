export class CurrentApi {
  private _api: API;

  constructor(api: API) {
    this._api = api;
  }

  public async send_simple_message(
    phone_number: string,
    text_message: string,
    reply?: boolean
  ) {
    try {
      return this._api.send_message(phone_number, text_message, reply);
    } catch (error) {
      return false;
    }
  }

  public async get_QR() {
    return this._api.get_qrCode();
  }

  // Getters
  public api_client(): any {
    return this._api._bot_client;
  }
  public session_name(): string {
    return this._api._api_name as string;
  }
  public session_status(): APIStatus {
    return this._api._status;
  }
}

// Main Interface
export interface API {
  _bot_client?: any;
  _api_name?: string;
  _save_token?: boolean;
  _qr_log: string;
  _status: APIStatus;

  send_message(
    phone_number: string,
    text_message: string,
    reply?: boolean
  ): Promise<CommForm>;
  get_qrCode(): Promise<CommForm>;
  close_connection(): Promise<CommForm>;
  parse_message(msg: any): Promise<IMessage_format>;
}

export interface CommForm {
  result: boolean;
  message: string;
}

export enum APIStatus {
  inactive = 0,
  awaiting_qr = 1,
  active = 2,
}

// Message format interface for the API
export interface IMessage_format {
  //Message
  id?: string;
  body?: string;
  text?: string;
  /* type?: chat_type; */
  from?: string;
  to?: string;
  isForwarded?: boolean;
  chat_id?: string;
  isFrom_group?: boolean;
  isMedia?: boolean;
  last_chat_message_id?: string;
  not_Spam?: boolean;
  timestamp?: number | string;
  //Sender
  sender_id?: string;
  sender_name?: string;
  sender_number?: string;
  sender_pfp?: string;
  //Extra params
  command_key?: string;
  command_key_raw?: string;
  command_params?: Array<string>;
  specific?: any;
  //Venom Client
  client_name?: any;
}

/* enum chat_type {
    image = "image",
    chat = "chat",
    list_response = "list_response",
    unknown = "unknown"
} */
