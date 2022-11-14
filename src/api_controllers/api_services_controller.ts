import axios from "axios";
import { CurrentApi } from "../api_models/api_services_model";
import { baileys_api } from "../api_models/baileys/api_baileys";
import { pedroslopez_api } from "../api_models/pedroslopez/api_pedroslopez";

export enum APIS_TYPES {
  whatsapp_web_js = "whatsapp_web_js",
  baileys = "baileys_api",
}

export abstract class ApiServicesController {
  // Session Management
  private static _sessions_instances: Array<CurrentApi> = [];

  public static Push_session(_session: CurrentApi) {
    //Empurra para o array de sessões
    this._sessions_instances.push(_session);
  }

  public static Create_session(
    _session_name: string /* , _choosenApi: CurrentApi */
  ): boolean {
    try {
      // Verifica se já existe uma sessão com o mesmo nome
      let current_api: CurrentApi | boolean = this.Get_session(_session_name);
      if (!current_api) {
        current_api = new CurrentApi(new baileys_api(_session_name)); //FIXME: Dynamic API types
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

  public static Get_session(_session_name: string): CurrentApi | boolean {
    let running_session = this._sessions_instances.find(
      (el) => el.session_name() == _session_name
    );
    return running_session ? running_session : false;
  }

  public static Get_session_status(_session_name: string) {
    let running_session = this.Get_session(_session_name) as CurrentApi;
    let response = running_session
      ? { session: running_session, status: running_session.session_status() }
      : { session: false, status: false };
    return response;
  }

  public static Remove_session(
    _session_name: string,
    _session?: CurrentApi
  ): boolean {
    let running_session;

    if (!_session) {
      running_session = this.Get_session(_session_name);
    } else {
      running_session = _session;
      _session_name = _session.session_name();
    }

    if (running_session) {
      try {
        this._sessions_instances = this._sessions_instances.filter(
          (el) => el.session_name() !== _session_name
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

  // Session Management End

  // This function is responsible to propagate all the received messages to diferent APIS by post route, in "campanhas" context is pretty useless, but I'll let this
  // if is ever needed in the future!
  public static Propagate_message(api_type: APIS_TYPES, message_object: any) {
    const LIST = JSON.parse(process.env.subscribers as any);

    LIST.forEach((element: any) => {
      axios
        .post(element, {
          message: message_object,
          service: api_type,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(`Error on post request to subs: \n ${error}`);
        });
    });
  }
}
