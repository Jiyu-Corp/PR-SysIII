import { useEffect, useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { CarIcon, User, UserIcon } from "@phosphor-icons/react";
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
import { PrsysError } from "@renderer/types/prsysErrorType";
import { getErrorMessage } from "@renderer/utils/utils";
import Swal from 'sweetalert2';
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
  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [models, setModels] = useState<SelectOption[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<SelectOption[]>([]);
  const [clients, setClients] = useState<SelectOption[]>([]);
  
  // Options Fetch
  useEffect(() => {
    setIsLoading(true);

    const fetches: Promise<void>[] = [
      fetchBrands(),
      fetchModels(),
      fetchVehicleTypes(),
      fetchClients()
    ];

    Promise.all(fetches).then(() => setIsLoading(false));
  }, []);

  async function fetchBrands() {
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
  async function fetchModels() {
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
  async function fetchVehicleTypes() {
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
  async function fetchClients() {
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
        <InputModal width="150px" label="Placa" value={plate} setValue={setPlate}  mask={'DDDNANN'} replacement={{ D: /[A-Z]/, N: /\d/, A: /[A-Za-z0-9]/}}/>
        <SelectModal width="210px" label="Marca" options={brands} value={idBrand} setValue={setIdBrand} />
        <SelectModal width="210px" label="Modelo" options={models} value={idModel} setValue={setIdModel} />
        <SelectModal width="210px" label="Tipo do Veiculo" options={vehicleTypes} value={idVehicleType} setValue={setIdVehicleType} />
        <InputModal width="210px" label="Ano" value={year} setValue={setYear}/>
        <InputModal width="155px" label="Cor" value={color} setValue={setColor} />
        <SelectModal width="210px" label="Cliente" options={clients} value={idClient} setValue={setIdClient} />
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