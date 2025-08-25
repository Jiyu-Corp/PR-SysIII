import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import { UserIcon  } from "@phosphor-icons/react";
import { Toaster } from "react-hot-toast";
import PriceTableModal from "@renderer/modals/PriceTableModal/PriceTableModal";
import { priceTableType } from "@renderer/types/resources/priceTableType";

export default function TabelaPrecoPage() {
  const navigate = useNavigate();
  const [isPriceTableModalOpen, setIsPriceTableModalOpen] = useState<boolean>(false);
  const [priceTableDetail, setPriceTableDetail] = useState<priceTableType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setIsPriceTableModalOpen(true);
  };

  const handleEdit = async (row: any) => {
    setPriceTableDetail({
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
    setIsPriceTableModalOpen(true);
  };

  useEffect(() => {
    if(!isPriceTableModalOpen) {
      setPriceTableDetail(undefined);
    }
  }, [isPriceTableModalOpen])

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericTop title="Tabelas de Preços" actionLabel="Cadastrar Tabela de Preço" onAction={handleCreate} onAction2={handleEdit} actionIcon={<UserIcon size={20} />} />
    </main>
    {isPriceTableModalOpen && <PriceTableModal isOpen={isPriceTableModalOpen} closeModal={() => setIsPriceTableModalOpen(false)} priceTable={priceTableDetail}/>}
  </>);
}