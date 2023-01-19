import { Request, Response } from "express"
import { ApiServicesController } from "../api_controllers/api_services_controller";
import { CommForm, CurrentApi } from "../api_models/api_services_model";

class OperationsController {
    public async Send(req: Request, res: Response) {

        let phone_number = req.body.phone_number ?? null;
        let text_message = req.body.text_message ?? null;
        let reply = req.body.reply ?? false;
        let session_name = req.params.session_name ?? false;

        //TODO: interface para validar número "@.us etc"
        if (!phone_number || !text_message || !session_name) {
            return res.status(400).send("Parâmentros insuficientes ou ausentes, body:" + req.body.text_message + req.body.phone_number);
        }

        let current_api = ApiServicesController.Get_session(session_name) as CurrentApi;
        if (!current_api) {
            return res.status(400).send(`Sessão ${session_name} não encontrada`);
        }

        let status = ApiServicesController.Get_session_status(session_name).status;

        if (status < 2) {
            return res.status(400).send(`Sessão ${session_name} não disponível`);
        }


        let result: CommForm = {} as CommForm;

        try {
            result = await current_api.send_simple_message(req.body.phone_number, req.body.text_message, reply) as CommForm;
        } catch (error) {
            return res.status(500).send("O envio falhou: " + error);
        }

        if (result.result) { return res.status(200).send(result.message); }
        return res.status(500).send(`O envio falhou, ${result.message}`);
    }

    public async GetGroupParticipants(req: Request, res: Response) {

        let session_name = req.params.session_name ?? false;
        let group_id = req.params.group_id ?? false;

        if (!session_name || !group_id) {
            return res.status(400).send("Parâmentros insuficientes ou ausentes");
        }

        let current_api = ApiServicesController.Get_session(session_name) as CurrentApi;
        if (!current_api) {
            return res.status(400).send(`Sessão ${session_name} não encontrada`);
        }

        let status = ApiServicesController.Get_session_status(session_name).status;

        if (status < 2) {
            return res.status(400).send(`Sessão ${session_name} não disponível`);
        }

        let result: CommForm = {} as CommForm;

        try {
            result = await current_api.get_group_participants(group_id) as CommForm;
        } catch (error) {
            return res.status(500).send("Não foi possível resgatar participantes: " + error);
        }

        if (result.result) { return res.status(200).send(result.message); }
        return res.status(500).send(`Não foi possível resgatar participantes, ${result.message}`);
    }
}
export const operations_controller = new OperationsController();