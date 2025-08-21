import { useEffect, useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { User, UserIcon } from "@phosphor-icons/react";
import InputModal from "../InputModal/InputModal";

import "./ClienteModal.css"
import SaveBtnModal from "../SaveBtnModal";
import EditBtnModal from "../EditBtnModal";
import DeleteBtnModal from "../DeleteBtnModal";
import SelectModal from "../SelectModal/SelectModal";
import { requestPRSYS } from "@renderer/utils/http";
import toast from "react-hot-toast";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { clientType } from "@renderer/types/resources/clientType";

type ClienteModalProps = { 
  client: clientType | undefined;
  isOpen: boolean;
  closeModal: () => void; 
};

export default function ClienteModal({client, isOpen, closeModal}: ClienteModalProps) {
  // Control Params
  const [isLoading, setIsLoading] = useState(false);
  const isEdicaoCliente = typeof client !== 'undefined';

  // Inputs
  const idClient = client?.idClient;
	const [cpfCnpj, setCpfCnpj] = useState<string>(client?.cpfCnpj || '');
	const [name, setName] = useState<string>(client?.name || '');
	const [phone, setPhone] = useState<string>(client?.phone || '');
	const [email, setEmail] = useState<string>(client?.email || '');
	const [idClientEnterprise, setIdClientEnterprise] = useState<number | null>(client?.enterprise?.idClient || null);

  // Options
  const [clientEnterprises, setClientEnterprises] = useState<SelectOption[]>([]);
  
  // Options Fetch
  useEffect(() => {
    setIsLoading(true);

    const fetches: Promise<void>[] = [
      fetchClientEnterprises()
    ];

    Promise.all(fetches).then(() => setIsLoading(false));
  }, []);
  async function fetchClientEnterprises() {
    const enterpriseParams = {
      idClientType: 2
    }
    try {
      const activeEnterprisesRes = await requestPRSYS('client', '', 'GET', undefined, enterpriseParams);

      setClientEnterprises(activeEnterprisesRes.map(c => ({
        id: c.idClient,
        label: c.name 
      } as SelectOption))); 
    } catch(err) {
      toast.error('Erro ao consultar empresas', {
        style: {
          padding: '16px',
          color: '#C1292E',
        },
        iconTheme: {
          primary: '#C1292E',
          secondary: '#FFFAEE',
        },
      });
    }
  }

  // Behaviour
  const title = isEdicaoCliente
    ? "Editar Cliente"
    : "Cadastrar Cliente";

  // Actions
  async function saveClient() {
    const params = {
      name: name,
      cpfCnpj: cpfCnpj.replace(/\D/g, ""),
      email: email,
      phone: phone.replace(/\D/g, "").slice(2),
      idClientEnterprise: idClientEnterprise
    }
    try {
      await requestPRSYS('client', '', 'POST', params);

      closeModal();

      toast.success('Cliente criado.', successToastStyle);
    } catch(err) {
      toast.error((err as Error).message, errorToastStyle);
    }
  }

  async function editClient() {
    if(typeof idClient === 'undefined') return;

    const params = {
      idClient: idClient,
      name: name,
      cpfCnpj: cpfCnpj.replace(/\D/g, ""),
      email: email,
      phone: phone.replace(/\D/g, "").slice(2),
      idClientEnterprise: idClientEnterprise
    }
    try {
      await requestPRSYS('client', idClient.toString(), 'PUT', params);

      closeModal();

      toast.success('Cliente editado.', successToastStyle);
    } catch(err) {
      toast.error((err as Error).message, errorToastStyle);
    }
  }

  async function deleteClient() {
    if(typeof idClient === 'undefined') return;

    try {
      await requestPRSYS('client', idClient.toString(), 'DELETE');

      closeModal();

      toast.success('Cliente deletado.', successToastStyle);
    } catch(err) {
      toast.error((err as Error).message, errorToastStyle);
    }
  }

	return <Modal1 isLoading={isLoading} maxWidth="450px" title={title} isOpen={isOpen} closeModal={closeModal} entityIcon={UserIcon}>
    <div className="cliente-modal">
      <div className="inputs-wrapper">
        <InputModal width="150px" label="CPF/CNPJ" value={cpfCnpj} setValue={setCpfCnpj}  mask={cpfCnpj.length < 15 ? '___.___.___-__' : '__.___.___/____-__'} replacement={{ _: /\d/ }}/>
        <InputModal width="210px" label="Nome" value={name} setValue={setName}/>
        <InputModal width="155px" label="Telefone" value={phone} setValue={setPhone}  mask={phone.length < 18 ? '+55 (__) ____-____' : '+55 (__) _____-____'} replacement={{ _: /\d/ }}/>
        <InputModal width="205px" label="Email" value={email} setValue={setEmail}/>
        <SelectModal width="210px" label="Empresa" disabled={cpfCnpj.length > 14} options={clientEnterprises} value={idClientEnterprise} setValue={setIdClientEnterprise} />
      </div>
      <div className="btns-wrapper">
        {isEdicaoCliente
          ? <>
            <EditBtnModal action={editClient}/>
            <DeleteBtnModal action={deleteClient}/>
          </>
          : <>
            <SaveBtnModal action={saveClient}/>
          </>
        }
      </div>
    </div>
  </Modal1>
}