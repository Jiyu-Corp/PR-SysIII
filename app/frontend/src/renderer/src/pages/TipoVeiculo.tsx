import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import { CarIcon, UserIcon  } from "@phosphor-icons/react";
import { Toaster } from "react-hot-toast";
import VehicleTypeModal from "@renderer/modals/VehicleTypeModal/VehicleTypeModal";
import { vehicleTypeType } from "@renderer/types/resources/vehicleTypeType";

export default function TipoVeiculoPage() {
  const navigate = useNavigate();
  const [isVehicleTypeModalOpen, setIsVehicleTypeModalOpen] = useState<boolean>(false);
  const [vehicleTypeDetail, setVehicleTypeDetail] = useState<vehicleTypeType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setIsVehicleTypeModalOpen(true);
  };

  const handleEdit = async (row: any) => {
    setVehicleTypeDetail({
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
    setIsVehicleTypeModalOpen(true);
  };

  useEffect(() => {
    if(!isVehicleTypeModalOpen) {
      setVehicleTypeDetail(undefined);
    }
  }, [isVehicleTypeModalOpen])

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericTop title="Tipo de Veiculo" actionLabel="Cadastrar Tipo de Veiculo" onAction={handleCreate} actionIcon={<CarIcon size={20} />} />
    </main>
    {isVehicleTypeModalOpen && <VehicleTypeModal isOpen={isVehicleTypeModalOpen} closeModal={() => setIsVehicleTypeModalOpen(false)} vehicleType={vehicleTypeDetail}/>}
  </>);
}