export class CurrentApi {
    private _api: API;

    constructor(api: API) {
        this._api = api;
    }

    public send_simple_message(phone_number: string, text_message: string) {
        return this._api.send_message(phone_number, text_message);
    }

    // Getters
    public api_client(): any { return this._api._bot_client; }
}

// Main Interface
export interface API {
    _bot_client?: any;
    _api_name?: string;
    send_message(phone_number: string, text_message: string): boolean;
}