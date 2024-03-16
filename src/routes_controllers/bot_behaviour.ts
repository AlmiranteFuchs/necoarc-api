import { Request, Response } from "express"

class BotBehaviourConteroller {
    public Construct(req: Request, res: Response) {
        res.render('message_tree');
    }
}
export const bot_behaviour_controller = new BotBehaviourConteroller();