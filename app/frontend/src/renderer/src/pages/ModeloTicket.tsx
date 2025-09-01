import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import { ArticleIcon } from "@phosphor-icons/react";
import { Toaster } from "react-hot-toast";
import TicketModelModal from "@renderer/modals/TicketModel/TicketModelModal";
import { ticketModelType } from "@renderer/types/resources/ticketModelType";

export default function ModeloTicketPage() {
  const navigate = useNavigate();
  const [isTicketModelModalOpen, setIsTicketModelModalOpen] = useState<boolean>(false);
  const [ticketModelDetail, setTicketModelDetail] = useState<ticketModelType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setIsTicketModelModalOpen(true);
  };

  const handleEdit = async (row: any) => {
    setTicketModelDetail({
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
    setIsTicketModelModalOpen(true);
  };

  useEffect(() => {
    if(!isTicketModelModalOpen) {
      setTicketModelDetail(undefined);
    }
  }, [isTicketModelModalOpen])

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericTop title="Modelos de Ticket" actionLabel="Cadastrar Modelo de Ticket" onAction={handleCreate} actionIcon={<ArticleIcon size={20} />} />
    </main>
    {isTicketModelModalOpen && <TicketModelModal isOpen={isTicketModelModalOpen} closeModal={() => setIsTicketModelModalOpen(false)} ticketModel={ticketModelDetail}/>}
  </>);
}