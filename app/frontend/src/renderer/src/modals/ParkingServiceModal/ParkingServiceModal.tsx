import { useEffect, useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { ArrowBendLeftDownIcon, CarIcon, CurrencyDollarIcon, LetterCirclePIcon, PlusSquareIcon, XIcon } from "@phosphor-icons/react";
import InputModal from "../InputModal/InputModal";

import "./ParkingServiceModal.css"
import SaveBtnModal from "../SaveBtnModal";
import EditBtnModal from "../EditBtnModal";
import DeleteBtnModal from "../DeleteBtnModal";
import SelectModal from "../SelectModal/SelectModal";
import { requestPRSYS } from "@renderer/utils/http";
import toast from "react-hot-toast";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { parkingServiceType } from "@renderer/types/resources/parkingServiceType";
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";
import SelectCreateModal from "../SelectCreateModal/SelectCreateModal";
import { getErrorMessage } from "@renderer/utils/utils";
import { PrsysError } from "@renderer/types/prsysErrorType";
import ButtonModal from "../ButtonModal/ButtonModal";
import useEffectSkipFirstRender from "@renderer/hooks/effectSkipFirstRender";
import { vehicleType } from "@renderer/types/resources/vehicleType";
import { clientType } from "@renderer/types/resources/clientType";

type ParkingServiceModalProps = { 
  parkingService: parkingServiceType | undefined;
  isOpen: boolean;
  closeModal: () => void; 
};

export default function ParkingServiceModal({parkingService, isOpen, closeModal}: ParkingServiceModalProps) {
  // Control Params
  const [isLoading, setIsLoading] = useState(false);
  const isEdicaoParkingService = typeof parkingService !== 'undefined';
  const [isClientFieldsEnabled, setIsClientFieldsEnabled] = useState((parkingService && typeof parkingService.client !== 'undefined') || false);
  const [isVehicleSelectUsingPlate, setIsVehicleSelectUsingPlate] = useState(false);

  // Inputs
  const idParkingService = parkingService?.idParkingService;
  // Vehicle
  const [idVehicle, setIdVehicle] = useState<number | undefined>(parkingService?.vehicle?.idVehicle);
  const [plate, setPlate] = useState<SelectOption | null>(parkingService?.vehicle && { 
    id: parkingService.vehicle.plate,
    label: parkingService.vehicle.plate
  } as SelectOption || null);
  const [brand, setBrand] = useState<SelectOption | null>(parkingService?.vehicle && { 
    id: parkingService.vehicle.model.idBrand, 
    label: parkingService.vehicle.model.brand!.nameBrand 
  } as SelectOption || null);
  const [model, setModel] = useState<SelectOption | null>(parkingService?.vehicle && { 
    id: parkingService.vehicle.model.idModel,
    label: parkingService.vehicle.model.nameModel
  } as SelectOption || null);
  const [idVehicleType, setIdVehicleType] = useState<number | null>(parkingService?.vehicle?.model?.idVehicleType || null);
  const [year, setYear] = useState<string>(parkingService?.vehicle?.year || '');
  const [color, setColor] = useState<string>(parkingService?.vehicle?.color || '');

  // Client
  const [idClient, setIdClient] = useState<number | undefined>(parkingService?.client?.idClient);
	const [clientName, setClientName] = useState<SelectOption | null>(parkingService?.client && { 
    id: parkingService.client.idClient,
    label: parkingService.client.name
  } as SelectOption || null);
	const [cpfCnpj, setCpfCnpj] = useState<string>(parkingService?.client?.cpfCnpj || '');
  const cpfCpnjUnformater = (value: string) => value.replace(/\D/g, "");
	const [phone, setPhone] = useState<string>(parkingService?.client?.phone || '');
  const phoneUnformater = (value: string) => value.replace(/\+55/g, '').replace(/\D/g, "");
	const [email, setEmail] = useState<string>(parkingService?.client?.email || '');
	const [idClientEnterprise, setIdClientEnterprise] = useState<number | null>(parkingService?.client?.enterprise?.idClient || null);

  // Options
  const [plates, setPlates] = useState<SelectOptionGroup[]>([]);
  const [brands, setBrands] = useState<(SelectOption & {
    models?: ({ idVehicleType: number } & SelectOption)[];
  })[]>([]);
  const [models, setModels] = useState<SelectOptionGroup[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<SelectOption[]>([]);

  const [clientNames, setClientNames] = useState<SelectOption[]>([]);
  const [clientEnterprises, setClientEnterprises] = useState<SelectOption[]>([]);
  
  // Options Fetch
  useEffect(() => {
    setIsLoading(true);

    const fetches: Promise<void>[] = [
      fetchPlates(),
      fetchBrandsAndModels(),
      fetchVehicleTypes(),

      fetchClients(),
      fetchClientEnterprises()
    ];

    Promise.all(fetches).then(() => setIsLoading(false));
  }, []);
  async function fetchPlates() {
    try {
      const vehicles = await requestPRSYS('vehicle', '', 'GET');

      const vehiclesOptions = vehicles.map(v => ({
        id: v.plate,
        label: v.plate,
        vehicle: v
      } as SelectOption & {
        vehicle: vehicleType[];
      }));

      setPlates(vehiclesOptions);

    } catch(err) {
      toast.error('Erro ao consultar marcas', errorToastStyle);
    }
  }

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
      
      setClientNames(clients.map(c => ({
        id: c.idClient,
        label: c.name,
        client: c
      } as SelectOption & { client: clientType }))); 
    } catch(err) {
      toast.error('Erro ao consultar clientes', errorToastStyle);
    }
  }
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
  const title = isEdicaoParkingService
    ? "Editar Entrada"
    : "Estacionar Veiculo";

  useEffectSkipFirstRender(() => {
    populateModelOptionsWithSelectedBrand();
    
    if(isVehicleSelectUsingPlate) {
      setIsVehicleSelectUsingPlate(false);
      return;
    }
    setModel(null);
  }, [brand]);

  useEffectSkipFirstRender(() => {
    selectVehicleAndClientInputsWithPlate();
  }, [plate]);

  function selectVehicleAndClientInputsWithPlate() {
    setIsVehicleSelectUsingPlate(true);

    const plateWithVehicle = plate as SelectOption & { vehicle: vehicleType }
    if(plateWithVehicle && typeof plateWithVehicle.vehicle !== 'undefined') {
      const vehicle = plateWithVehicle.vehicle;

      setIdVehicle(vehicle.idVehicle);
      setBrand(brands.find(b => b.id === vehicle.model.brand?.idBrand) || null);
      setModel(brands.flatMap(b => b.models || []).find(m => m.id === vehicle.model.idModel) || null);
      setColor(vehicle.color || "");
      setYear(vehicle.year || "");
      
      const vehicleWithClient = vehicle as vehicleType & { client: clientType }
      if(vehicleWithClient.client){
        setIsClientFieldsEnabled(true);
        selectClientInputsWithClient(vehicleWithClient.client);
      }
    } else {
      setIdVehicle(undefined);
      setBrand(null);
      setModel(null);
      setColor("");
      setYear("");
    }
  }

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
  }, [model]);
  
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

  useEffectSkipFirstRender(() => {
    const client = (clientName as SelectOption & { client: clientType })?.client || null
    selectClientInputsWithClient(client);
  }, [clientName]);

  function selectClientInputsWithClient(client: clientType) {
    if(client) {
      setIdClient(client.idClient);
      setClientName(clientNames.find(cn => cn.id === client.idClient)!)
      setCpfCnpj(client.cpfCnpj);
      setPhone(client.phone || "");
      setEmail(client.email || "");
      setIdClientEnterprise(client.enterprise?.idClient || null);
    } else {
      setIdClient(undefined);
      setCpfCnpj("");
      setPhone("");
      setEmail("");
      setIdClientEnterprise(null);
    }
  }
  
  // Actions
  async function saveParkingService() {
    const params = {
      [idClient ? "clientEdit" : "clientCreate"]: isClientFieldsEnabled 
      ? {
        idClient: idClient,
        name: clientName?.label || null,
        cpfCnpj: cpfCnpj.replace(/\D/g, ""),
        email: email || undefined,
        phone: phone.replace(/\D/g, "").slice(2) || undefined,
        idClientEnterprise: idClientEnterprise
      }
      : undefined,
      [idVehicle ? "vehicleEdit" : "vehicleCreate"]: {
        idVehicle: idVehicle,
        plate: plate?.label || null,
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
    }
    try {
      await requestPRSYS('parking-service', '', 'POST', params);

      closeModal();

      toast.success('Veiculo estacionado.', successToastStyle);
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }
  
  async function deleteParkingService() {
  }

  return <Modal1 isLoading={isLoading} maxWidth={isClientFieldsEnabled ? "650px" : "450px" } title={title} isOpen={isOpen} closeModal={closeModal} entityIcon={LetterCirclePIcon}>
    <div className="parking-service-modal">
      <div className="inputs-wrapper">
        <div style={{width: "100%", display: "flex", gap: "16px"}}>
          <SelectCreateModal width="160px" label="Placa" options={plates} setOptions={setPlates} value={plate} setValue={setPlate} formatInput={(value:string) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}/>
          <InputModal width="140px" label="Cor" value={color} setValue={setColor} />
          <InputModal width="58px" label="Ano" value={year} setValue={setYear} mask={'____'} replacement={{ _: /\d/}} />
        </div>
        <SelectCreateModal width="180px" label="Marca" options={brands} setOptions={setBrands} value={brand} setValue={setBrand} />
        <SelectCreateModal width="180px" label="Modelo" options={models} setOptions={setModels} value={model} setValue={setModel} isGroupSelect={true} /> 
        <SelectModal width="180px" label="Tipo do Veiculo" options={vehicleTypes} value={idVehicleType} setValue={setIdVehicleType} />
      </div>
      <div className="btns-wrapper">
        <ButtonModal icon={ArrowBendLeftDownIcon} text={`${isClientFieldsEnabled ? "Remover Cliente" : "Adicionar Cliente"}`} color="#000000" backgroundColor="#FFFFFF" fontSize={16} action={() => setIsClientFieldsEnabled(prev => !prev)}/>
        {isEdicaoParkingService
          ? <>
            <DeleteBtnModal action={deleteParkingService}/>
          </>
          : <>
            <SaveBtnModal action={saveParkingService}/>
          </>
        }
      </div>
      {isClientFieldsEnabled && <> {
        <div className="client-inputs-wrapper">
          <div style={{width: "100%"}}>
            <SelectCreateModal width="270px" label="Nome" options={clientNames} setOptions={setClientNames} value={clientName} setValue={setClientName} menuMaxHeight={160}/>
          </div>
          <InputModal width="150px" label="CPF/CNPJ" value={cpfCnpj} setValue={setCpfCnpj}  mask={cpfCpnjUnformater(cpfCnpj).length < 12 ? '___.___.___-__' : '__.___.___/____-__'} replacement={{ _: /\d/ }} unformat={cpfCpnjUnformater}/>
          <InputModal width="155px" label="Telefone" value={phone} setValue={setPhone}  mask={phoneUnformater(phone).length < 11 ? '+55 (__) ____-____' : '+55 (__) _____-____'} replacement={{ _: /\d/ }} unformat={phoneUnformater}/>
          <InputModal width="205px" label="Email" value={email} setValue={setEmail}/>
          <SelectModal width="210px" label="Empresa" disabled={cpfCnpj.length > 14} options={clientEnterprises} value={idClientEnterprise} setValue={setIdClientEnterprise} menuMaxHeight={100}/>
        </div>
      }</>}
    </div>
  </Modal1>
}