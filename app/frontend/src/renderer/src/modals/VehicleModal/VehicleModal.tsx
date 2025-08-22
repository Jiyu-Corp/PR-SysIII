import { useEffect, useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { CarIcon } from "@phosphor-icons/react";
import InputModal from "../InputModal/InputModal";

import "./VehicleModal.css"
import SaveBtnModal from "../SaveBtnModal";
import EditBtnModal from "../EditBtnModal";
import DeleteBtnModal from "../DeleteBtnModal";
import SelectModal from "../SelectModal/SelectModal";
import { requestPRSYS } from "@renderer/utils/http";
import toast from "react-hot-toast";
import { errorToastStyle } from "@renderer/types/ToastTypes";
import { vehicleType } from "@renderer/types/resources/vehicleType";

type VehicleModalProps = { 
  vehicle: vehicleType | undefined;
  isOpen: boolean;
  closeModal: () => void; 
};

export default function VehicleModal({vehicle, isOpen, closeModal}: VehicleModalProps) {
  // Control Params
  const [isLoading, setIsLoading] = useState(false);
  const isEdicaoVehicle = typeof vehicle !== 'undefined';

  // Inputs
  const idVehicle = vehicle?.idVehicle;
  const [plate, setPlate] = useState<string>(vehicle?.plate || '');
  const [idBrand, setIdBrand] = useState<number | null>(vehicle?.model.idBrand || null);
  const [idModel, setIdModel] = useState<number | null>(vehicle?.model.idModel || null);
  const [idVehicleType, setIdVehicleType] = useState<number | null>(vehicle?.model.idVehicleType || null);
  const [year, setYear] = useState<string>(vehicle?.year || '');
  const [color, setColor] = useState<string>(vehicle?.color || '');
  const [idClient, setIdClient] = useState<number | null>(vehicle?.idClient || null);

  // Options
  const [brands, setBrands] = useState<{
    idBrand: number;
    brand: string;
    models: SelectOption[];
  }[]>([]);
  const [models, setModels] = useState<SelectOption[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<SelectOption[]>([]);
  const [clients, setClients] = useState<SelectOption[]>([]);
  
  // Options Fetch
  useEffect(() => {
    setIsLoading(true);

    const fetches: Promise<void>[] = [
      fetchBrands(),
      fetchVehicleTypes(),
      fetchClients()
    ];

    Promise.all(fetches).then(() => setIsLoading(false));
  }, []);

  async function fetchBrands() {
    try {
      const brands = await requestPRSYS('brand', 'getActiveBrands', 'GET');

      setBrands(brands.map(b => ({
        idBrand: b.idBrand,
        brand: b.name,
        models: b.models.map(m => ({
          id: m.idModel,
          label: m.name
        } as SelectOption))
      } as {
        idBrand: number;
        brand: string;
        models: SelectOption[];
      })));
    } catch(err) {
      toast.error('Erro ao consultar marcas', errorToastStyle);
    }
  }
  async function fetchVehicleTypes() {
    try {
      const vehicleTypes = await requestPRSYS('vehicle-type', '', 'GET');

      setVehicleTypes(vehicleTypes.map(c => ({
        id: c.idVehicleType,
        label: c.description 
      } as SelectOption))); 
    } catch(err) {
      toast.error('Erro ao consultar tipos de veiculos', errorToastStyle);
    }
  }
  async function fetchClients() {
    try {
      const clients = await requestPRSYS('client', '', 'GET');

      setClients(clients.map(c => ({
        id: c.idClient,
        label: c.name 
      } as SelectOption))); 
    } catch(err) {
      toast.error('Erro ao consultar clientes', errorToastStyle);
    }
  }

  // Behaviour
  const title = isEdicaoVehicle
    ? "Editar Veiculo"
    : "Cadastrar Veiculo";

  // Actions
  async function saveVehicle() {
  }

  async function editVehicle() {
  }

  async function deleteVehicle() {
  }

  return <Modal1 isLoading={isLoading} maxWidth="450px" title={title} isOpen={isOpen} closeModal={closeModal} entityIcon={CarIcon}>
    <div className="vehicle-modal">
      <div className="inputs-wrapper">
        <InputModal width="120px" label="Placa" value={plate} setValue={setPlate} mask={'_______'} replacement={{ _: /[A-Z0-9]/}} onChange={(value:string) => setPlate(value.toUpperCase())}/>
        <InputModal width="170px" label="Cor" value={color} setValue={setColor} />
        <InputModal width="58px" label="Ano" value={year} setValue={setYear} mask={'____'} replacement={{ _: /\d/}} />
        <SelectModal width="180px" label="Marca" options={brands} value={idBrand} setValue={setIdBrand} />
        <SelectModal width="180px" label="Modelo" options={models} value={idModel} setValue={setIdModel} /> 
        <SelectModal width="180px" label="Tipo do Veiculo" options={vehicleTypes} value={idVehicleType} setValue={setIdVehicleType} />
        <SelectModal width="180px" label="Cliente" options={clients} value={idClient} setValue={setIdClient} />
      </div>
      <div className="btns-wrapper">
        {isEdicaoVehicle
          ? <>
            <EditBtnModal action={editVehicle}/>
            <DeleteBtnModal action={deleteVehicle}/>
          </>
          : <>
            <SaveBtnModal action={saveVehicle}/>
          </>
        }
      </div>
    </div>
  </Modal1>
}