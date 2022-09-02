import axios from "axios";

export enum APIS_TYPES {
    whatsapp_web_js = "whatsapp_web_js",
    baileys = "baileys_api"
}

export abstract class ApiServicesController {

    // This function is responsible to propagate all the received messages to diferent APIS by post route, in "campanhas" context is pretty useless, but I'll let this
    // if is ever needed in the future!
     
    public static Propagate_message(api_type: APIS_TYPES, message_object: any) {
        const LIST = JSON.parse(process.env.subscribers as any);

        LIST.forEach((element: any) => {
            axios.post(element, {
                message: message_object,
                service: api_type,
            }).then(function (response) {
                console.log(response);
            }).catch(function (error) {
                console.log(`Error on post request to subs: \n ${error}`);
            })
        });
    }
}