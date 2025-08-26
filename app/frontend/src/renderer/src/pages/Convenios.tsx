import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import { HandshakeIcon, UserIcon  } from "@phosphor-icons/react";
import { Toaster } from "react-hot-toast";
import AgreementModal from "@renderer/modals/AgreementModal/AgreementModal";
import { agreementType } from "@renderer/types/resources/agreementType";

export default function ConvenioPage() {
  const navigate = useNavigate();
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState<boolean>(false);
  const [agreementDetail, setAgreementDetail] = useState<agreementType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setIsAgreementModalOpen(true);
  };

  const handleEdit = async (row: any) => {
    setAgreementDetail({
      idClient: Number(row.id),
      name: row.name,
      cpfCnpj: row.cpf_cnpj,
      email: row.email,
      phone: row.phone,
      enterprise: row.idClientEnterprise
        ? {
            idClient: Number(row.idClientEnterprise),
            name: row.enterprise ?? row.enterprise ?? "" 
          }
        : undefined
    });
    setIsAgreementModalOpen(true);
  };

  useEffect(() => {
    if(!isAgreementModalOpen) {
      setAgreementDetail(undefined);
    }
  }, [isAgreementModalOpen])

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericTop title="Convenios" actionLabel="Cadastrar Convenio" onAction={handleCreate} onAction2={handleEdit} actionIcon={<HandshakeIcon size={20} />} />
    </main>
    {isAgreementModalOpen && <AgreementModal isOpen={isAgreementModalOpen} closeModal={() => setIsAgreementModalOpen(false)} agreement={agreementDetail}/>}
  </>);
}