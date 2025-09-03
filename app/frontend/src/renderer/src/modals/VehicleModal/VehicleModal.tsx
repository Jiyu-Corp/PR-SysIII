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
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { vehicleType } from "@renderer/types/resources/vehicleType";
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";
import SelectCreateModal from "../SelectCreateModal/SelectCreateModal";
import { getErrorMessage } from "@renderer/utils/utils";
import { PrsysError } from "@renderer/types/prsysErrorType";
import useEffectSkipFirstRender from "@renderer/hooks/effectSkipFirstRender";
import Swal from 'sweetalert2';

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
  const [brand, setBrand] = useState<SelectOption | null>(vehicle && { 
    id: vehicle.model.idBrand, 
    label: vehicle.model.brand!.nameBrand 
  } as SelectOption || null);
  const [model, setModel] = useState<SelectOption | null>(vehicle && { 
    id: vehicle.model.idModel,
    label: vehicle.model.nameModel
  } as SelectOption || null);
  const [idVehicleType, setIdVehicleType] = useState<number | null>(vehicle?.model?.idVehicleType || null);
  const [year, setYear] = useState<string>(vehicle?.year || '');
  const [color, setColor] = useState<string>(vehicle?.color || '');
  const [idClient, setIdClient] = useState<number | null>(vehicle?.idClient || null);

  // Options
  const [brands, setBrands] = useState<(SelectOption & {
    models?: ({ idVehicleType: number } & SelectOption)[];
  })[]>([]);
  const [models, setModels] = useState<SelectOptionGroup[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<SelectOption[]>([]);
  const [clients, setClients] = useState<SelectOption[]>([]);
  
  // Options Fetch
  useEffect(() => {
    setIsLoading(true);

    const fetches: Promise<void>[] = [
      fetchBrandsAndModels(),
      fetchVehicleTypes(),
      fetchClients()
    ];

    Promise.all(fetches).then(() => setIsLoading(false));
  }, []);

  async function fetchBrandsAndModels() {
    try {
      const brands = await requestPRSYS('brand', 'getActiveBrands', 'GET');

      const brandsOptions = brands.map(b => ({
        id: b.idBrand,
        label: b.name,
        models: b.models.map(m => ({
          id: m.idModel,
          label: m.name,
          idVehicleType: m.vehicleType.idVehicleType
        } as { idVehicleType: number } & SelectOption))
      } as SelectOption & {
        models: SelectOption[];
      }));

      setBrands(brandsOptions);

      populateModelOptionsWithSelectedBrand(brandsOptions);

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
  
  useEffectSkipFirstRender(() => {
    populateModelOptionsWithSelectedBrand();
    setModel(null);
  }, [brand])

  function populateModelOptionsWithSelectedBrand(brandsOptions?: (SelectOption & {
    models?: SelectOption[];
  })[]) {
    if(typeof brandsOptions === 'undefined')
      brandsOptions = brands;

    const selectedBrand = brandsOptions.find(b => b.id == brand?.id);

    const modelOptions = typeof selectedBrand !== 'undefined'
      ? [{
        label: selectedBrand.label,
        options: selectedBrand.models || []
      } as SelectOptionGroup]
      : brand === null
        ? brandsOptions.map(b => ({
          label: b.label,
          options: b.models || []
        } as SelectOptionGroup))
        : [];

    setModels(modelOptions);
  }
  
  useEffectSkipFirstRender(() => {
    selectVehicleTypeWithSelectedModel();
  }, [model])

  function selectVehicleTypeWithSelectedModel() {
   if(model === null) {
    setIdVehicleType(null);
    return;
   }  

   const idVehicleTypeOfModel = brands
    .flatMap(b => b.models)
    .find(m => m?.id === model.id)
    ?.idVehicleType

    setIdVehicleType(idVehicleTypeOfModel || null);
  }
  
  // Actions
  async function saveVehicle() {
    const params = {
      plate: plate,
      model: {
        idModel: model && model.id !== -1 
          ? Number(model.id)
          : undefined,
        nameModel: model?.label,
        idVehicleType: idVehicleType && Number(idVehicleType) || undefined,
        idBrand: brand && brand.id !== -1
          ? Number(brand.id)
          : undefined,
        brand: {
          nameBrand: brand?.label
        }
      },
      year: year && Number(year) || undefined,
      color: color || undefined,
      idClient: idClient && Number(idClient) || undefined
    }
    try {
      await requestPRSYS('vehicle', '', 'POST', params);

      closeModal();

      toast.success('Veiculo criado.', successToastStyle);
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }
  
  async function editVehicle() {
    if(typeof idVehicle === 'undefined') return;

    const params = {
      idVehicle: idVehicle,
      plate: plate,
      model: {
        idModel: model && model.id !== -1 
          ? Number(model.id)
          : undefined,
        nameModel: model?.label,
        idVehicleType: idVehicleType && Number(idVehicleType) || undefined,
        idBrand: brand && brand.id !== -1
          ? Number(brand.id)
          : undefined,
        brand: {
          nameBrand: brand?.label
        }
      },
      year: year && Number(year) || undefined,
      color: color || undefined,
      idClient: idClient && Number(idClient) || undefined
    }
    try {
      await requestPRSYS('vehicle', idVehicle.toString(), 'PUT', params);

      closeModal();

      toast.success('Veículo editado.', successToastStyle);
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }

  async function deleteVehicle() {
    if(typeof idVehicle === 'undefined') return;

    try {

      const result = await Swal.fire({
        title: "Confirmação",
        text: "Tem certeza que deseja excluir este veículo?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim, excluir",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await requestPRSYS('vehicle', idVehicle.toString(), 'DELETE');
  
        closeModal();
  
        toast.success('Veículo deletado.', successToastStyle);
      }
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }

  return <Modal1 isLoading={isLoading} maxWidth="450px" title={title} isOpen={isOpen} closeModal={closeModal} entityIcon={CarIcon}>
    <div className="vehicle-modal">
      <div className="inputs-wrapper">
        <InputModal width="120px" label="Placa" value={plate} setValue={setPlate} mask={'_______'} replacement={{ _: /[A-Z0-9]/}} onChange={(value:string) => setPlate(value.toUpperCase())} required={true}/>
        <InputModal width="170px" label="Cor" value={color} setValue={setColor}/>
        <InputModal width="58px" label="Ano" value={year} setValue={setYear} mask={'____'} replacement={{ _: /\d/}} />
        <SelectCreateModal width="180px" label="Marca" options={brands} setOptions={setBrands} value={brand} setValue={setBrand} required={true}/>
        <SelectCreateModal width="180px" label="Modelo" options={models} setOptions={setModels} value={model} setValue={setModel} isGroupSelect={true} required={true}/> 
        <SelectModal width="180px" label="Tipo do Veiculo" options={vehicleTypes} value={idVehicleType} setValue={setIdVehicleType} required={true}/>
        <SelectModal width="180px" label="Cliente" options={clients} value={idClient} setValue={setIdClient}/>
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