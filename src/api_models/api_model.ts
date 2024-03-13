export class ApiSessions {
    private _api: APISession;

    constructor(api: APISession) {
        this._api = api;
    }

    // Getters
    public api_client(): any {
        return this._api._client;
    }
    public session_id(): string {
        return this._api._session_id as string;
    }
    public session_status(): APISessionStatus {
        return this._api._status;
    }
}

export interface APISession {
    _session_id: string;
    _client?: any;
    _qr_log: string | undefined;
    _status: APISessionStatus;


    // send_message(
    //     phone_number: string,
    //     text_message: string,
    //     reply?: boolean
    // ): Promise<CommForm>;
    // get_qrCode(): Promise<CommForm>;
    // close_connection(): Promise<CommForm>;
    // parse_message(msg: any): Promise<IMessage_format>;
}

export enum APISessionStatus {
    inactive,
    awaiting_qr,
    active,
    failed
}

