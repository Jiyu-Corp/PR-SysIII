import { useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { User, UserIcon } from "@phosphor-icons/react";

type ClienteModalProps = { 
  client: {
    idClient: number;
    cpfCnpj: string;
    name: string;
    phone: string;
    email: string;
    enterprise: {
      idClient: number;
      name: string
    } 
  } | undefined;
  isOpen: boolean;
  closeModal: () => void; 
};

export default function ClienteModal({client, isOpen, closeModal}: ClienteModalProps) {
  const idClient = client?.idClient;
	const [cpfCnpj, setCpfCnpj] = useState<string>(client?.cpfCnpj || '');
	const [name, setName] = useState<string>(client?.name || '');
	const [phone, setPhone] = useState<string>(client?.phone || '');
	const [email, setEmail] = useState<string>(client?.email || '');
	const [idClientEnterprise, setIdClientEnterprise] = useState<number | null>(client?.enterprise.idClient || null);

  const title = typeof client !== 'undefined'
    ? "Editar Cliente"
    : "Cadastrar Cliente";

	return <Modal1 title={title} isOpen={isOpen} closeModal={closeModal} entityIcon={UserIcon}>
    <div className="inputs-wrapper"></div>
    <div className="btns-wrapper"></div>
  </Modal1>
}