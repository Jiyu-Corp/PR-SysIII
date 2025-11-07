import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import GenericFilters from "../components/Filters/Filters";
import GenericTable from "../components/Table/Table";
import { UserIcon, PencilIcon, TrashIcon, CurrencyDollarIcon } from "@phosphor-icons/react";
import { Toaster, toast } from "react-hot-toast";
import PriceTableModal from "@renderer/modals/PriceTableModal/PriceTableModal";
import { priceTableType } from "@renderer/types/resources/priceTableType";
import { FilterField } from "@renderer/types/FilterTypes";
import { TableColumn } from "@renderer/types/TableTypes";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { requestPRSYS } from '@renderer/utils/http'
import { Grid } from "react-loader-spinner";
import { getErrorMessage, numeroParaMoeda } from "@renderer/utils/utils";
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";
import Swal from 'sweetalert2';
import { PrsysError } from "@renderer/types/prsysErrorType";
import ButtonModal from "@renderer/modals/ButtonModal/ButtonModal";
import HelpModal from "@renderer/modals/HelpModal/HelpModal";

export default function TabelaPrecoPage() {
  const navigate = useNavigate();
  const [isPriceTableModalOpen, setIsPriceTableModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [priceTableDetail, setPriceTableDetail] = useState<priceTableType | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  const [rows, setRows] = useState<priceTableType[]>([]);
  const [filtered, setFiltered] = useState<priceTableType[] | null>(null);

  const [vehicleTypeOptions, setvehicleTypeOptions] = useState<SelectOption[]>([]);

  function openHelpMenuWithF1(event: KeyboardEvent): void {
    if(event.key !== "F1") return;
    event.preventDefault();

    setIsHelpModalOpen(prev => !prev);
  }

  useEffect(() => {
    setLoading(true);

    window.addEventListener("keydown", openHelpMenuWithF1);

    const fetches: Promise<void>[] = [
      fetchPrice(),
      fetchVehicleType()
    ];

    Promise.all(fetches).then(() => setLoading(false));

    return () => {
      window.removeEventListener("keydown", openHelpMenuWithF1);
    }
  }, []);

  const fetchPrice = async () => {
        setLoading(true);
        try {
          const response = await requestPRSYS('price-table', '', 'GET');
          
          const arr = Array.isArray(response) ? response : response?.data ?? [];
          
          const mapped: priceTableType[] = (arr as any[]).map((item: any) => {
            return {
                idPriceTable: item.idPriceTable,
                pricePerHour: item.pricePerHour,
                pricePerHourTabela: numeroParaMoeda(item.pricePerHour),
                toleranceMinutes: item.toleranceMinutes ?? '---',
                idVehicleType: item.vehicleType?.idVehicleType,
                priceTableHours: item.priceTableHours,
                vehicleTypeName: item.vehicleType?.description,
                dateRegister: item.dateRegister.split('-').reverse().join('/')
              };
          });    
          
          if (mapped.length) {
            setRows(mapped);
            setFiltered(null);
          } else {
            setRows([]);
            setFiltered(null);
            console.warn("fetchPrice: response:", response);
          }
          
        } catch (err) {
          console.error("fetchPrice error:", err);
        } finally {
          setLoading(false);
        }
  };

  async function fetchVehicleType() {
    try {
      const vehicleTypes = await requestPRSYS('vehicle-type', '', 'GET');
      
      setvehicleTypeOptions(vehicleTypes.map(c => ({
        id: c.idVehicleType,
        label: c.description 
      } as SelectOption))); 
    } catch(err) {
      toast.error('Erro ao consultar tipos de veiculos', errorToastStyle);
    }
  }

  const filters: FilterField[] = [  
    { key: "idVehicleType", label: "Tipo de Veículo", 
      type: "select",
      options: vehicleTypeOptions
    },
    {
      key: "dateExpiration",
      label: "Data inicial",
      type: "date"
    },
    {
      key: "dateRegister",
      label: "Data final",
      type: "date"
    },
  ];

  const columns: TableColumn<priceTableType>[] = [
    { key: "vehicleTypeName", label: "Tipo de veículo" },
    { key: "pricePerHourTabela", label: "Preço por hora" },
    { key: "toleranceMinutes", label: "Tolerância(min)" },
    { key: "dateRegister", label: "Data de cadastro" }
  ];

  const actions = [
    {
      key: "view",
      label: "Visualizar",
      icon: <PencilIcon size={14} />,
      className: 'icon-btn-view',
      onClick: (row: priceTableType) => {
        handleEdit(row);
      },
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <TrashIcon size={14} />,
      className: 'icon-btn-delete',
      onClick: (row: priceTableType) => {
        handleDelete(String(row.idPriceTable!));
      },
    }
  ];

  const handleSearch = async (values: Record<string, any>) => {
      
      const idVehicleType = values.idVehicleType;
      const dateExpiration = values.dateExpiration ? String(values.dateExpiration) : null;
      const dateRegister = values.dateRegister ? String(values.dateRegister) : null;
      
      if (!idVehicleType && !dateExpiration && !dateRegister) {
        setFiltered(null);
        return;
      }
  
      setLoading(true);
      try {
        
        const params = {
          idVehicleType: idVehicleType,
          dateExpirationStart: dateExpiration?.split('/').reverse().join('-'),
          dateExpirationEnd: dateRegister?.split('/').reverse().join('-') 
        }
        
        const response = await requestPRSYS('price-table', '', 'GET', undefined, params);
        const arr = Array.isArray(response) ? response : response?.data ?? [];
        
        if(response.length < 1 || !response){
          toast.error('Nenhum dado para esses filtros', errorToastStyle);
        }
        
        const mapped: priceTableType[] = (arr as any[]).map((item: any) => ({
            idPriceTable: item.idPriceTable,
            pricePerHour: item.pricePerHour,
            toleranceMinutes: item.toleranceMinutes ?? '---',
            idVehicleType: item.vehicleType?.idVehicleType,
            priceTableHours: item.priceTableHours ,
            vehicleTypeName: item.vehicleType?.description,
            dateRegister: item.dateRegister
        }));
    
        setFiltered(mapped);
  
      } catch (err) {
        toast.error('Verifique os filtros para estarem no padrão correto', errorToastStyle);
        console.error("handleSearch erro:", err);
      } finally {
        setLoading(false);
      }
  };

  const handleCreate = () => {
    setIsPriceTableModalOpen(true);
  };

  const handleEdit = async (row: any) => {
    setPriceTableDetail({
      idPriceTable: row.idPriceTable,
      pricePerHour: row.pricePerHour,
      toleranceMinutes: row.toleranceMinutes,
      idVehicleType: row.idVehicleType,
      priceTableHours: row.priceTableHours
    });
    setIsPriceTableModalOpen(true);
  };

  const handleDelete = async (id: string) => {
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
        await requestPRSYS("price-table", `${id}`, "DELETE");
        toast.success("tabela excluída com sucesso!", successToastStyle);
        fetchPrice();
      }
    } catch (error) {
      console.error("Erro ao excluir tabela:", error);
      toast.error(getErrorMessage(error as PrsysError), errorToastStyle);
    }
  };

  useEffect(() => {
    if(!isPriceTableModalOpen) {
      setPriceTableDetail(undefined);
      fetchPrice();
      fetchVehicleType();
    }
  }, [isPriceTableModalOpen])

  const handleGenerateCSV = () => {
    const data = (filtered ?? rows).map((r: any) => ({
      Tipo: r.vehicleTypeName,
      Preco: r.pricePerHour,
      Tolerancia: r.toleranceMinutes,
      Cadastro: r.dateRegister
    }));

    const csv = [
      Object.keys(data[0]).join(";"),
      ...data.map((row) => Object.values(row).map((v) => `"${String(v ?? "")}"`).join(";")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tabelapreco.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rowsToShow = filtered ?? rows;

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericFilters title="Tabela de Preços" fields={filters} onSearch={handleSearch} buttons={[
        <ButtonModal key={0} text="Cadastrar Tabela de Preço" action={handleCreate} color="#FFFFFF" backgroundColor="#3BB373" icon={CurrencyDollarIcon}/>,
      ]}/>
      {loading ? 
          <div style={{ margin: "24px 64px" }}>
          <Grid
            visible={true}
            height="80"
            width="80"
            color="#4A87E8"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{justifyContent: "center"}}
            wrapperClass="grid-wrapper"
          />
        </div>
        : 
          <GenericTable
            title="Listagem de Tabela de Preços"
            columns={columns}
            rows={rowsToShow}
            actions={actions}
            total={rowsToShow.length}
            onGenerateCSV={handleGenerateCSV}
          />
      }
    </main>
    {isPriceTableModalOpen && <PriceTableModal isOpen={isPriceTableModalOpen} closeModal={() => setIsPriceTableModalOpen(false)} priceTable={priceTableDetail}/>}
    {isHelpModalOpen && <HelpModal isOpen={isHelpModalOpen} closeModal={() => setIsHelpModalOpen(false)} helpIcon={CurrencyDollarIcon} 
      helpTitle="Tabelas de Preços" 
      helpText={
        `Nesta aba são listados as tabelas de preços ativas e cadastradas no sistema. Podemos usa-la para:\n`+
        `1. Cadastrar uma nova tabela de preço no botão "Cadastrar Tabela de Preço."\n\n` +
        `2. Para cadastrar uma tabela de preço, é necessario um tipo de veiculo que não possua uma tabela de preço vinculada.\n\n` +
        `3. O cadastro do tipo de veículo NÃO pode ser feito nesta parte do sistema, para isso acesse o menu "Tipo de Veículo".\n\n` +
        `4. A tabela de preço não pode ser editada caso tenha algum veiculo vinculada a ela que esteja estacionado.\n\n` +
        `5. Editar uma tabela de preço cadastrada, clicando no botão com icone de lapis no final da tabela.\n\n` +
        `6. Remover uma tabela de preço cadastrada, clicando no botão "Remover" dentro da janela de edição da tabela de preço, aberta ao clicar no icone de lapis no final da tabela.`
      }/>
    }
  </>);
}