import { Request, Response } from "express"
import { current_api } from "..";
import { CommForm } from "../api_models/api_services_model";
import QRCode from 'qrcode';
import path from "path";
import { existsSync, unlinkSync } from "fs";

class GetQRController {
    public async Get(req: Request, res: Response) {
        let result: CommForm = {} as CommForm;

        try {
            result = await current_api.get_QR() as CommForm;

            if (existsSync(path.resolve(__dirname, '../../qrCodeLogs', 'qr.png'))) { // and, the QR file is exists
                unlinkSync(path.resolve(__dirname, '../../qrCodeLogs', 'qr.png')); // delete it
            }
            
            await QRCode.toFile(path.resolve(__dirname, '../../qrCodeLogs', 'qr.png'), result.message);

            return res.sendFile(path.resolve(__dirname, '../../qrCodeLogs', 'qr.png'));
        } catch (error) {
            return res.status(500).send("Não foi possível resgatar QR: " + error);
        }

        /*  if (result.result) { return res.status(200).send(result.message); }
         return res.status(500).send(`Não foi possível resgatar QR: ${result.message}`); */
    }
}
export const get_QR_controller = new GetQRController();