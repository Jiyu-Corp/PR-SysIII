export type clientType = {
  idClient: number;
  cpfCnpj: string;
  name: string;
  phone: string;
  email: string;
  enterprise?: {
    idClient: number;
    name: string
  } 
}