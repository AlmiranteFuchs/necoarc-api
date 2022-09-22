import { Request, Response } from "express"
import { ApiServicesController } from "../api_controllers/api_services_controller";
import { CommForm, CurrentApi } from "../api_models/api_services_model";

class SendSimpleMessageController {
    public async Send(req: Request, res: Response) {

        let phone_number = req.body.phone_number ?? null;
        let text_message = req.body.text_message ?? null;
        let reply = req.body.reply ?? false;
        let session_name = req.params.session_name ?? false;
        
        //TODO: interface para validar número "@.us etc"
        if (!phone_number || !text_message || !session_name) {
            return res.status(400).send("Parâmentros insuficientes ou ausentes");
        }

        let current_api = ApiServicesController.Get_session(session_name) as CurrentApi;
        if (!current_api) {
            return res.status(400).send(`Sessão ${session_name} não encontrada`);
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
}
export const send_simple_message_controller = new SendSimpleMessageController();