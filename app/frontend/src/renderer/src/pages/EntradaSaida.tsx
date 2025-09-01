import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import { UserIcon  } from "@phosphor-icons/react";
import { Toaster } from "react-hot-toast";
import ParkingServiceModal from "@renderer/modals/ParkingServiceModal/ParkingServiceModal";
import { parkingServiceType } from "@renderer/types/resources/parkingServiceType";

export default function EntradaSaidaPage() {
  const navigate = useNavigate();
  const [isParkingServiceModalOpen, setIsParkingServiceModalOpen] = useState<boolean>(false);
  const [parkingServiceDetail, setParkingServiceDetail] = useState<parkingServiceType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setIsParkingServiceModalOpen(true);
  };

  const handleEdit = async (row: any) => {
    setParkingServiceDetail({
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
    setIsParkingServiceModalOpen(true);
  };

  const handleEditTest = async () => {
    setParkingServiceDetail({
      idParkingService: 4,
      vehicle: {
        idVehicle: 8,
        plate: "ATD6E75",
        color: "Prata",
        year: "2011",
        model: {
          idModel: 4,
          nameModel: "Fit",
          idVehicleType: 1,
          idBrand: 10,
          brand: {
            idBrand: 10,
            nameBrand: "Honda"
          },
        }
      },
      client: undefined
    });
    setIsParkingServiceModalOpen(true);
  }

  useEffect(() => {
    if(!isParkingServiceModalOpen) {
      setParkingServiceDetail(undefined);
    }
  }, [isParkingServiceModalOpen])

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericTop title="Veiculos Estacionados" actionLabel="Estacionar Veiculo" onAction={handleCreate} actionIcon={<UserIcon size={20} />} actionLabel2="Teste baixar parking" onAction2={handleEditTest}/>
    </main>
    {isParkingServiceModalOpen && <ParkingServiceModal isOpen={isParkingServiceModalOpen} closeModal={() => setIsParkingServiceModalOpen(false)} parkingService={parkingServiceDetail}/>}
  </>);
}