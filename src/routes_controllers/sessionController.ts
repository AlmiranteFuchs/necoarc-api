import { Request, Response } from "express"
import { existsSync, mkdirSync, unlinkSync } from "fs";
import QRCode from 'qrcode';
import path from "path";
import { ApiServicesController } from "../api_controllers/api_services_controller";

class SessionController {
    public async Create(req: Request, res: Response) {

        // let session_name = req.params.session_name ?? false;

        // if (!session_name) { return res.status(400).send("Parâmentros insuficientes ou ausentes") }

        // try {
        //     let result = ApiServicesController.Create_session(session_name);

        //     if (result) { return res.status(200).send("Sessão criada com sucesso"); }

        //     return res.status(500).send("Não foi possível criar sessão");
        // } catch (error) {
        //     return res.status(500).send("Não foi possível criar sessão: " + error);
        // }
    }

    public async GetQR(req: Request, res: Response) {
        // let result: CommForm = {} as CommForm;

        // let session_name = req.params.session_name ?? false;
        // if (!session_name) {
        //     return res.status(400).send("Parâmentros insuficientes ou ausentes");
        // }

        // // Type casting bc I suck at typescript
        // let current_api = ApiServicesController.Get_session(session_name) as CurrentApi;
        // if (!current_api) {
        //     return res.status(400).send(`Sessão ${session_name} não encontrada`);
        // }

        // try {
        //     result = await current_api.get_QR() as CommForm;

        //     if (result.result) {
        //         if (!existsSync(path.resolve(__dirname, '../../qrCodeLogs'))) {
        //             mkdirSync(path.resolve(__dirname, '../../qrCodeLogs'));
        //         }

        //         if (existsSync(path.resolve(__dirname, '../../qrCodeLogs', 'qr.png'))) { // and, the QR file is exists
        //             unlinkSync(path.resolve(__dirname, '../../qrCodeLogs', 'qr.png')); // delete it
        //         }

        //         await QRCode.toFile(path.resolve(__dirname, '../../qrCodeLogs', 'qr.png'), result.message);

        //         return res.sendFile(path.resolve(__dirname, '../../qrCodeLogs', 'qr.png'));
        //     }
        //     return res.status(500).send("Não foi possível resgatar QR: " + result.message);
        // } catch (error) {
        //     return res.status(500).send("Não foi possível resgatar QR: " + error);
        // }
    }

    public async Status(req: Request, res: Response) {

        // let session_name = req.params.session_name ?? false;

        // if (!session_name) { return res.status(400).send("Parâmentros insuficientes ou ausentes") }

        // try {
        //     let result = ApiServicesController.Get_session_status(session_name);

        //     // Vide APIStatus enum
        //     if (result) { return res.status(200).send(`${result.status}`); }

        //     return res.status(500).send("Não foi possível buscar status da sessão: não encontrada");
        // } catch (error) {
        //     return res.status(500).send("Não foi possível buscar status da sessão: " + error);
        // }
    }
}
export const session_controller = new SessionController();