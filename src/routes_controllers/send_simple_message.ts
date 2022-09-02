import { Request, Response } from "express"
import { current_api } from "..";
import { CommForm } from "../api_models/api_services_model";

class SendSimpleMessageController {
    public async Send(req: Request, res: Response) {

        let phone_number = req.body.phone_number ?? null;
        let text_message = req.body.text_message ?? null;
        let reply = req.body.reply ?? false;

        //TODO: interface para validar número "@.us etc"
        if (!phone_number || !text_message) {
            return res.status(500).send("Parâmentros insuficientes ou ausentes");
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