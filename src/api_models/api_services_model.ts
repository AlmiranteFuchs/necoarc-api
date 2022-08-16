export class CurrentApi {
    private _api: API;
    private _api_name: string;

    constructor(api: API, name: string) {
        this._api = api;
        this._api_name = name;
    }

    public send_simple_message() {
        return this._api.send_message();
    }

}

export interface API {
    send_message(): boolean;
}

//Exemple
export class pedroslopezWaWeb implements API{
    send_message(): boolean {
        throw new Error("Method not implemented.");
    }
}