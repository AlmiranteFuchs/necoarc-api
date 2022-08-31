import { Request, Response } from "express"
import { current_api } from "..";

class SendSimpleMessageController {
    public async Send(req: Request, res: Response) {

        let phone_number = req.body.phone_number ?? null;
        let text_message = req.body.text_message ?? null;
        let reply = req.body.reply ?? false;

        if (!phone_number || !text_message) {
            return res.status(500).send("Parâmentros insuficientes ou ausentes, dê uma olhada ai meu caro");
        }

        let result: boolean = false;
        try {
            result = await current_api.send_simple_message(req.body.phone_number, req.body.text_message, reply);
        } catch (error) {
            return res.status(500).send("Algo de errado aconteceu... óh ceus... o que será? ah, sim: " + error);
        }

        if (result) { return res.sendStatus(200); }
        return res.status(500).send("Algo aconteceu, não faço ideia...");
    }
}
export const send_simple_message_controller = new SendSimpleMessageController();