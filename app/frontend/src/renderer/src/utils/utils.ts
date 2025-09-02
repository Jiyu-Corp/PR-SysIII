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

export function numeroParaMoeda(value: number): string {
    if (value === null || value === undefined) return '---';
    if (typeof value !== 'number') {
      const parsed = Number(String(value).replace(',', '.'));
      if (Number.isNaN(parsed)) return '---';
      value = parsed;
    }
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatPercentage(value: number): string {
    if (value === null || value === undefined) return '---';
    if (typeof value !== 'number') {
      const parsed = Number(String(value).replace(',', '.'));
      if (Number.isNaN(parsed)) return '---';
      value = parsed;
    }
  
    const isFraction = Math.abs(value) <= 1;
    const percentValue = isFraction ? value * 100 : value;
    
    return `${percentValue}%`;
  };

export function formatDateTime(date: Date): string {
  const pad = (n: number): string => n.toString().padStart(2, '0');

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${hours}:${minutes} - ${day}/${month}/${year}`;
}