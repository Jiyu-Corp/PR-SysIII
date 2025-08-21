import { useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { User, UserIcon } from "@phosphor-icons/react";
import { InputMask } from '@react-input/mask';
import InputModal from "../InputModal/InputModal";

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
    <div className="inputs-wrapper">
      <InputModal label="CPF/CNPJ" value={cpfCnpj} setValue={setCpfCnpj}  mask={cpfCnpj.length < 14 ? '___.___.___-__' : '__.___.___/____-__'} replacement={{ _: /\d/ }}/>
      <InputModal label="Nome" value={name} setValue={setName}/>
      <InputModal label="Telefone" value={phone} setValue={setPhone}  mask={phone.length < 18 ? '+55 (__) ____-____' : '+55 (__) _____-____'} replacement={{ _: /\d/ }}/>
      <InputModal label="Email" value={email} setValue={setEmail}/>
    </div>
    <div className="btns-wrapper"></div>
  </Modal1>
}