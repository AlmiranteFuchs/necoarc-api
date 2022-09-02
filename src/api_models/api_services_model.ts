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

    // Getters
    public api_client(): any { return this._api._bot_client; }
}

// Main Interface
export interface API {
    _bot_client?: any;
    _api_name?: string;
    _active: boolean;
    send_message(phone_number: string, text_message: string, reply?: boolean): Promise<CommForm>;
}

export interface CommForm {
    result: boolean
    message: string
}
export const commForm: CommForm = {
    result: false,
    message: ""
}
