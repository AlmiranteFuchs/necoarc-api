export class CurrentApi {
    private _api: API;

    constructor(api: API) {
        this._api = api;
    }

    public async send_simple_message(phone_number: string, text_message: string, reply?: boolean) {
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
    public api_client(): any { return this._api._bot_client; }
    public session_name(): string { return this._api._api_name as string; }
}

// Main Interface
export interface API {
    _bot_client?: any;
    _api_name?: string;
    _active: boolean;
    _save_token?: boolean;
    _qr_log: string;

    send_message(phone_number: string, text_message: string, reply?: boolean): Promise<CommForm>;
    get_qrCode(): Promise<CommForm>;
    close_connection(): Promise<CommForm>;
}

export interface CommForm {
    result: boolean
    message: string
}
export const commForm: CommForm = {
    result: false,
    message: ""
}
