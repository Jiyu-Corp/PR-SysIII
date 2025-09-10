import { useEffect, useState } from "react";
import Modal1 from "../Modal1/Modal1";
import { ArrowBendLeftDownIcon, CarIcon, CurrencyDollarIcon, PlusSquareIcon, XIcon } from "@phosphor-icons/react";
import InputModal from "../InputModal/InputModal";

import "./PriceTableModal.css"
import SaveBtnModal from "../SaveBtnModal";
import EditBtnModal from "../EditBtnModal";
import DeleteBtnModal from "../DeleteBtnModal";
import SelectModal from "../SelectModal/SelectModal";
import { requestPRSYS } from "@renderer/utils/http";
import toast from "react-hot-toast";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { priceTableType } from "@renderer/types/resources/priceTableType";
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";
import SelectCreateModal from "../SelectCreateModal/SelectCreateModal";
import { getErrorMessage } from "@renderer/utils/utils";
import { PrsysError } from "@renderer/types/prsysErrorType";
import ButtonModal from "../ButtonModal/ButtonModal";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import Swal from "sweetalert2";

type PriceTableModalProps = { 
  priceTable: priceTableType | undefined;
  isOpen: boolean;
  closeModal: () => void; 
};

type PriceTableHour = {
  idPriceTableHour: number | null;
  hour: string;
  price: string;
}

export default function PriceTableModal({priceTable, isOpen, closeModal}: PriceTableModalProps) {
  // Control Params
  const [isLoading, setIsLoading] = useState(false);
  const isEdicaoPriceTable = typeof priceTable !== 'undefined';
  const [isSpecialHoursOpen, setIsSpecialHoursOpen] = useState(typeof priceTable?.priceTableHours !== 'undefined' && priceTable?.priceTableHours.length > 0 || false);

  // Inputs
  const idPriceTable = priceTable?.idPriceTable;
  const [pricePerHour, setPricePerHour] = useState<string>(priceTable?.pricePerHour || '');
  const [toleranceMinutes, setToleranceMinutes] = useState<string>(priceTable?.toleranceMinutes || '');
  const [idVehicleType, setIdVehicleType] = useState<number | null>(priceTable?.idVehicleType || null);
  const [priceTableHours, setPriceTableHours] = useState<PriceTableHour[]>(priceTable?.priceTableHours || []);

  // Options
  const [vehicleTypes, setVehicleTypes] = useState<SelectOption[]>([]);
  
  // Options Fetch
  useEffect(() => {
    setIsLoading(true);

    const fetches: Promise<void>[] = [
      fetchVehicleTypes()
    ];

    Promise.all(fetches).then(() => setIsLoading(false));
  }, []);

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
  
  // Behaviour
  const title = isEdicaoPriceTable
    ? "Editar Tabela de Preço"
    : "Cadastrar Tabela de Preço";

  const formatPricePerHour = (newValue: string) => {
    let formattedValue = newValue
      .replace(/[^0-9.,]/g, "")
      .replace(/(?<!\d)[.,]/g, "")
      .replace(/([.,]).*[.,]/g, "$1");
    
    const isCommaSeparator = formattedValue.indexOf(",") !== -1;
    const positionOfSeparator = isCommaSeparator
      ? formattedValue.indexOf(",")
      : formattedValue.indexOf(".");
    if(positionOfSeparator !== -1)
      formattedValue = formattedValue.slice(0, (positionOfSeparator + 3));

    const numericValue = parseFloat(formattedValue.replace(/,/g, "."));
    
    return formattedValue == "" || numericValue<=1000
      ? formattedValue
      : positionOfSeparator !== -1
        ? formattedValue.slice(0, positionOfSeparator-1) + formattedValue.slice(positionOfSeparator)
        : formattedValue.slice(0, -1);
  }
  const formatToleranceTime = (newValue: string) => {
    if(newValue === "") return "";
    const formattedValue = Number(newValue.replace(/\D/g, ""));

    return formattedValue<=60 
      ? formattedValue.toString() 
      : "60";
  }
  const formatSpecialHour = (newValue: string) => {
    const formattedValue = Number(newValue.replace(/\D/g, ""));

    return formattedValue<=24 
      ? formattedValue.toString() 
      : "24";
  }

  useEffect(() => {
    if(priceTableHours.length == 0)
      setIsSpecialHoursOpen(false);
  }, [priceTableHours]);
  
  // Actions
  async function savePriceTable() {
    const params = {
      idVehicleType: idVehicleType,
      pricePerHour: parseFloat(pricePerHour.replace(/,/g, ".")),
      toleranceMinutes: toleranceMinutes ? Number(toleranceMinutes) : null,
      priceTableHours: priceTableHours.map(pth => ({
        hour: Number(pth.hour),
        price: parseFloat(pth.price.replace(/,/g, "."))
      }))
    }
    try {
      await requestPRSYS('price-table', '', 'POST', params);

      closeModal();

      toast.success('Tabela criada.', successToastStyle);
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }
  
  async function editPriceTable() {
    if(typeof idPriceTable === 'undefined') return;

    const params = {
      idPriceTable: idPriceTable,
      idVehicleType: idVehicleType,
      pricePerHour: typeof pricePerHour === 'string' ? parseFloat(pricePerHour.replace(/,/g, ".")) : pricePerHour,
      toleranceMinutes: toleranceMinutes ? Number(toleranceMinutes) : null,
      priceTableHours: priceTableHours.map(pth => ({
        idPriceTableHour: pth.idPriceTableHour,
        hour: Number(pth.hour),
        price: typeof pth.price === "string" ? parseFloat(pth.price.replace(/,/g, ".")) : pth.price
      }))
    }
    
    try {
      await requestPRSYS('price-table', idPriceTable.toString(), 'PUT', params);

      closeModal();

      toast.success('Tabela editada.', successToastStyle);
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }

  async function deletePriceTable() {
    if(typeof idPriceTable === 'undefined') return;

    try {

      const result = await Swal.fire({
        title: "Confirmação",
        text: "Tem certeza que deseja excluir esta tabela?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim, excluir",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await requestPRSYS('price-table', idPriceTable.toString(), 'DELETE');
  
        closeModal();
  
        toast.success('Tabela deletada.', successToastStyle);
      }
    } catch(err) {
      toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
    }
  }

  function addNewPriceTableHour() {
    const newPriceTableHour: PriceTableHour = {
      idPriceTableHour: null,
      hour: "",
      price: ""
    }

    const newPriceTableHours = [ ...priceTableHours, newPriceTableHour ];

    setPriceTableHours(newPriceTableHours);
  }

  function updatePriceTableHour(pth: PriceTableHour, attribute: string) {
    return (newValue: string) => {
      setPriceTableHours(prev => 
        prev.map(oldPth =>
          oldPth === pth ? { ...pth, [attribute]: newValue } : oldPth
        )
      )
    } 
  }

  function deletePriceTableHour(pth: PriceTableHour) {
    const newPriceTableHours = priceTableHours.filter(element => element != pth);
    
    setPriceTableHours(newPriceTableHours);
  }

  return <Modal1 isLoading={isLoading} maxWidth="500px" title={title} isOpen={isOpen} closeModal={closeModal} entityIcon={CurrencyDollarIcon}>
    <div className="price-table-modal">
      <div className="inputs-wrapper">
        <SelectModal width="150px" label="Tipo do Veiculo" options={vehicleTypes} value={idVehicleType} setValue={setIdVehicleType} required />
        <InputModal width="70px" label="Preço(R$)" value={pricePerHour} setValue={setPricePerHour} formatInput={formatPricePerHour} required/>
        <InputModal width="90px" label="Tolerancia(min)" value={toleranceMinutes} setValue={setToleranceMinutes} formatInput={formatToleranceTime} />
      </div>
      <div className="btns-wrapper">
        <ButtonModal icon={ArrowBendLeftDownIcon} text="Horas Especiais" color="#000000" backgroundColor="#FFFFFF" fontSize={16} action={() => setIsSpecialHoursOpen(true)} isDisabled={isSpecialHoursOpen}/>
        {isEdicaoPriceTable
          ? <>
            <EditBtnModal action={editPriceTable}/>
            <DeleteBtnModal action={deletePriceTable}/>
          </>
          : <>
            <SaveBtnModal action={savePriceTable}/>
          </>
        }
      </div>
      {isSpecialHoursOpen && <div className="special-hours-wrapper">
        {priceTableHours.map((pth, idx) => <div className="special-hour-wrapper" key={idx}>
          <h1 className="special-hour-idx">#{idx+1}</h1>
          <span className="special-hour-delete" onClick={() => deletePriceTableHour(pth)}>
            <XIcon/>
          </span>
          <InputModal width="70px" placeholder="Hora" value={pth.hour} setValue={updatePriceTableHour(pth, "hour")} formatInput={formatSpecialHour}/>
          <InputModal width="70px" placeholder="Preço" value={pth.price} setValue={updatePriceTableHour(pth, "price")} formatInput={formatPricePerHour}/>
        </div>)}
        <div className="special-hour-creator-wrapper" onClick={addNewPriceTableHour}>
          <PlusSquareIcon size={40} opacity={0.5} cursor={"pointer"}/>
        </div>
      </div>}
    </div>
  </Modal1>
}