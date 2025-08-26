export type clientType = {
  idClient: number;
  cpfCnpj: string;
  name: string;
  phone?: string;
  email?: string;
  enterprise?: {
    idClient: number;
    name: string
  } 
}

export type ClientRow = {
  id: string;
  name: string;
  cpf_cnpj: string;
  phone?: string;
  email?: string;
  enterprise?: string;
  type?: "cnpj" | "cpf";
};