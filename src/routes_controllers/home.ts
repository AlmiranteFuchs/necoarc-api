import { Request, Response } from "express"

class HomeConteroller {
    public Home(req: Request, res: Response) {
        res.send(
            "Serviço de envio de mensagem da Manfing, author: Fuchs!",
        )
    }
}
export const home_controller = new HomeConteroller();