import { PrsysError } from "@renderer/types/prsysErrorType";

export function getErrorMessage(error: PrsysError): string {
    if(typeof error.message === 'string') return error.message;

    return error.message.join('\n');
}

export function formatCpfCnpj(cpfCnpj: string): string {
    if (!cpfCnpj) return '';

    const cleaned = cpfCnpj.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleaned.length === 14) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return cleaned; 
}

export function formatPhone(phone: string): string {
    if (!phone) return '';

    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return cleaned;
}