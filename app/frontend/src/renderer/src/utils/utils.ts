import { PrsysError } from "@renderer/types/prsysErrorType";

export function getErrorMessage(error: PrsysError): string {
    if(typeof error.message === 'string') return error.message;

    return error.message.join('\n');
}
