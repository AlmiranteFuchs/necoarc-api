import { ApiSessions } from "../api_models/api_model";
import { wwebjs_api } from "../api_models/wwebjs/api_wweb";

export enum APIS_TYPES {
  whatsapp_web_js = "whatsapp_web_js",
  baileys = "baileys_api",
}

export abstract class ApiServicesController {
  // Session Management
  private static _sessions_instances: Array<ApiSessions> = [];

  public static Push_session(_session: ApiSessions) {
    //Empurra para o array de sessões
    this._sessions_instances.push(_session);
  }

  public static Create_session(
    _session_name: string, _choosenApi: ApiSessions
  ): boolean {
    try {
      // Verifica se já existe uma sessão com o mesmo nome
      let current_api: ApiSessions | boolean = this.Get_session(_session_name);
      if (!current_api) {
        current_api = _choosenApi; //FIXME: Dynamic API types
        this.Push_session(current_api);
        console.log(`⚡️[Neco]: Sessão criada: ${_session_name}`);
        return true;
      }
      console.log(`⚡️[Neco]: Sessão ${_session_name} já existe!`);
      return false;
    } catch (error) {
      console.log(
        `⚡️[Neco]: Não foi possível criar sessão ${_session_name}: ${error}`
      );
      return false;
    }
  }

  public static Get_session(_session_name: string): ApiSessions | boolean {
    let running_session = this._sessions_instances.find(
      (el) => el.session_id() == _session_name
    );
    return running_session ? running_session : false;
  }

  public static Get_session_status(_session_name: string) {
    let running_session = this.Get_session(_session_name) as ApiSessions;
    let response = running_session
      ? { session: running_session, status: running_session.session_status() }
      : { session: false, status: false };
    return response;
  }

  public static Remove_session(
    _session_name: string,
    _session?: ApiSessions
  ): boolean {
    let running_session;

    if (!_session) {
      running_session = this.Get_session(_session_name);
    } else {
      running_session = _session;
      _session_name = _session.session_id();
    }

    if (running_session) {
      try {
        this._sessions_instances = this._sessions_instances.filter(
          (el) => el.session_id() !== _session_name
        );
        //TODO: Implement logging out of session inside API
        console.log(`⚡️[Neco]: Sessão removida: ${_session_name}`);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    console.log(`⚡️[Neco]: Sessão ${_session_name} não encontrada!`);
    return false;
  }
}
