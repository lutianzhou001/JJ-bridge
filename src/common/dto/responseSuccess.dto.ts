
// success: true => message, data
// success: false => errorMessage, error
import { IResponse } from '../interfaces/response.interface';

export class ResponseSuccess implements IResponse {
    constructor(infoMessage: string, data?: any, notLog?: boolean) {
        this.success = true;
        this.message = infoMessage;
        this.data = data;
        if (!notLog) {
            try {
                const offuscateRequest = JSON.parse(JSON.stringify(data));
                if (offuscateRequest && offuscateRequest.token) { offuscateRequest.token = '*******' };
                console.log(new Date().toString() + ' - [Response]: ' + JSON.stringify(offuscateRequest))
            } catch (error) {
                console.log(error)
            }
        }
    }
    message: string;
    data: any[];
    errorMessage: any;
    error: any;
    success: boolean;
}
