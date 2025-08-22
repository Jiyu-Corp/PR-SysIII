import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import { UserIcon  } from "@phosphor-icons/react";
import ClienteModal from "@renderer/modals/ClienteModal/ClienteModal";
import { Toaster } from "react-hot-toast";

export default function VeiculosPage() {
  const navigate = useNavigate();
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState<boolean>(false);
  const [vehicleDetail, setVehicleDetail] = useState<vehicleType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setIsVehicleModalOpen(true);
  };

  const handleEdit = async (row: any) => {
    setVehicleDetail({
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
    setIsVehicleModalOpen(true);
  };

  useEffect(() => {
    if(!isVehicleModalOpen) {
      setVehicleDetail(undefined);
    }
  }, [isVehicleModalOpen])

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericTop title="Clientes" actionLabel="Cadastrar Cliente" onAction={handleCreate} onAction2={handleEdit} actionIcon={<UserIcon size={20} />} />
    </main>
    {isVehicleModalOpen && <ClienteModal isOpen={isVehicleModalOpen} closeModal={() => setVehicleDetail(false)} client={vehicleDetail}/>}
  </>);
}
