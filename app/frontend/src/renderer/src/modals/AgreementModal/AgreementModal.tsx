import { useEffect, useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { HandshakeIcon, User, UserIcon } from "@phosphor-icons/react";
import InputModal from "../InputModal/InputModal";

import "./AgreementModal.css"
import SaveBtnModal from "../SaveBtnModal";
import EditBtnModal from "../EditBtnModal";
import DeleteBtnModal from "../DeleteBtnModal";
import SelectModal from "../SelectModal/SelectModal";
import { requestPRSYS } from "@renderer/utils/http";
import toast from "react-hot-toast";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { agreementType } from "@renderer/types/resources/agreementType";
import { PrsysError } from "@renderer/types/prsysErrorType";
import { getErrorMessage } from "@renderer/utils/utils";
import Swal from 'sweetalert2';
import { SelectOption } from "@renderer/types/ReactSelectTypes";

type AgreementModalProps = { 
  agreement: agreementType | undefined;
  isOpen: boolean;
  closeModal: () => void; 
};

export default function AgreementModal({agreement, isOpen, closeModal}: AgreementModalProps) {
  // Control Params
  const [isLoading, setIsLoading] = useState(false);
  const isEdicaoAgreement = typeof agreement !== 'undefined';

  // Inputs
  const idAgreement = agreement?.idAgreement;
	const [idClient, setIdClient] = useState<number | null>(agreement?.idClient|| null);
  const [fixDiscount, setFixDiscount] = useState<string>(agreement?.fixDiscount || '');
  const [percentageDiscount, setPercentageDiscount] = useState<string>(agreement?.percentageDiscount || '');
  const [dateExpiration, setDateExpiration] = useState<string>(agreement?.dateExpiration || '');

  // Options
  const [agreementEnterprises, setClientEnterprises] = useState<SelectOption[]>([]);
  
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
      toast.error('Erro ao consultar empresas', errorToastStyle);
    }
  }

  // Behaviour
  const title = isEdicaoAgreement
    ? "Editar convenio"
    : "Cadastrar convenio";

  const formatFixDiscount = (newValue: string) => {
    let formattedValue = newValue
      .replace(/[^0-9.,]/g, "")
      .replace(/(?<!\d)[.,]/g, "")
      .replace(/([.,]).*[.,]/g, "$1");
    
    const isCommaSeparator = formattedValue.indexOf(",") !== -1;
    const positionOfSeparator = isCommaSeparator
      ? formattedValue.indexOf(",")
      : formattedValue.indexOf(".");
    if(positionOfSeparator !== -1)
      formattedValue = formattedValue.slice(0, (positionOfSeparator + 3));

    const numericValue = parseFloat(formattedValue.replace(/,/g, "."));
    
    return formattedValue == "" || numericValue<=1000
      ? formattedValue
      : positionOfSeparator !== -1
        ? formattedValue.slice(0, positionOfSeparator-1) + formattedValue.slice(positionOfSeparator)
        : formattedValue.slice(0, -1);
  }

  const formatPercentageDiscount = (newValue: string) => {
    if(newValue === "") return "";
    const formattedValue = Number(newValue.replace(/\D/g, ""));

    return formattedValue<=100 
      ? formattedValue.toString()
      : "100";
  }

  // Actions
  async function saveAgreement() {
    const params = {
      idClient: idClient,
      fixDiscount: fixDiscount ? parseFloat(fixDiscount.replace(/,/g, ".")) : undefined,
      percentageDiscount: percentageDiscount ? Number(percentageDiscount) : undefined,
      dateExpiration: dateExpiration.split('/').reverse().join('-')
    }
    try {
      await requestPRSYS('agreement', '', 'POST', params);

      closeModal();

      toast.success('Convenio criado.', successToastStyle);
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }

  async function editAgreement() {
  }

  async function deleteAgreement() {
  }

  return <Modal1 isLoading={isLoading} maxWidth="450px" title={title} isOpen={isOpen} closeModal={closeModal} entityIcon={HandshakeIcon}>
    <div className="agreement-modal">
      <div className="inputs-wrapper">
        <div style={{width: "100%", marginBottom: 4}}>
          <SelectModal width="180px" label="Empresa" options={agreementEnterprises} value={idClient} setValue={setIdClient} />
        </div>
        <InputModal width="90px" label="Desconto Fixo" value={fixDiscount} setValue={setFixDiscount} disabled={percentageDiscount != ""} formatInput={formatFixDiscount}/>
        <InputModal width="78px" label="Desconto(%)" value={percentageDiscount} setValue={setPercentageDiscount} disabled={fixDiscount != ""} formatInput={formatPercentageDiscount}/>
        <InputModal width="115px" label="Data de Expiração" value={dateExpiration} setValue={setDateExpiration} placeholder="dd/mm/yyyy" mask="dd/mm/yyyy" replacement={{ d: /\d/, m: /\d/, y: /\d/ }}/>
      </div>
      <div className="btns-wrapper">
        {isEdicaoAgreement
          ? <>
            <EditBtnModal action={editAgreement}/>
            <DeleteBtnModal action={deleteAgreement}/>
          </>
          : <>
            <SaveBtnModal action={saveAgreement}/>
          </>
        }
      </div>
    </div>
  </Modal1>
}