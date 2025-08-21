import { useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { User, UserIcon } from "@phosphor-icons/react";
import InputModal from "../InputModal/InputModal";

import "./ClienteModal.css"
import SaveBtnModal from "../SaveBtnModal";
import EditBtnModal from "../EditBtnModal";
import DeleteBtnModal from "../DeleteBtnModal";

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

  const isEdicaoCliente = typeof client !== 'undefined';

  const title = isEdicaoCliente
    ? "Editar Cliente"
    : "Cadastrar Cliente";

	return <Modal1 maxWidth="450px" title={title} isOpen={isOpen} closeModal={closeModal} entityIcon={UserIcon}>
    <div className="cliente-modal">
      <div className="inputs-wrapper">
        <InputModal width="140px" label="CPF/CNPJ" value={cpfCnpj} setValue={setCpfCnpj}  mask={cpfCnpj.length < 14 ? '___.___.___-__' : '__.___.___/____-__'} replacement={{ _: /\d/ }}/>
        <InputModal width="220px" label="Nome" value={name} setValue={setName}/>
        <InputModal width="145px" label="Telefone" value={phone} setValue={setPhone}  mask={phone.length < 18 ? '+55 (__) ____-____' : '+55 (__) _____-____'} replacement={{ _: /\d/ }}/>
        <InputModal width="220px" label="Email" value={email} setValue={setEmail}/>
      </div>
      <div className="btns-wrapper">
        {isEdicaoCliente
          ? <>
            <EditBtnModal action={() => {}}/>
            <DeleteBtnModal action={() => {}}/>
          </>
          : <>
            <SaveBtnModal action={() => {}}/>
          </>
        }
      </div>
    </div>
  </Modal1>
}