import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import GenericFilters from "../components/Filters/Filters";
import GenericTable from "../components/Table/Table";
import { UserIcon, PencilIcon, TrashIcon  } from "@phosphor-icons/react";
import { Toaster, toast } from "react-hot-toast";
import ParkingServiceModal from "@renderer/modals/ParkingServiceModal/ParkingServiceModal";
import { parkingServiceType } from "@renderer/types/resources/parkingServiceType";
import { FilterField } from "@renderer/types/FilterTypes";
import { TableColumn } from "@renderer/types/TableTypes";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { requestPRSYS } from '@renderer/utils/http'
import { Grid } from "react-loader-spinner";
import { numeroParaMoeda, formatPercentage, getErrorMessage } from "@renderer/utils/utils";
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";
import Swal from 'sweetalert2';
import { PrsysError } from "@renderer/types/prsysErrorType";

export default function EntradaSaidaPage() {
  const navigate = useNavigate();
  const [isParkingServiceModalOpen, setIsParkingServiceModalOpen] = useState<boolean>(false);
  const [parkingServiceDetail, setParkingServiceDetail] = useState<parkingServiceType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState<parkingServiceType[]>([]);
  const [filtered, setFiltered] = useState<parkingServiceType[] | null>(null);

  useEffect(() => {
    setLoading(true);

    fetchEntradaSaida().then(() => setLoading(false));
  }, []);

  const fetchEntradaSaida = async () => {
        setLoading(true);
        try {
          const response = await requestPRSYS('parking-service', 'getOpenServices', 'GET');
          
          const arr = Array.isArray(response) ? response : response?.data ?? [];
          
          const mapped: parkingServiceType[] = (arr as any[]).map((item: any) => {
            return {
                idParkingService: item.idParkingService,
                vehicle: item.vehicle,
                client: item.clientEntry ?? '---',
                plate: item.vehicle.plate,
                color: item.vehicle.color,
                entry: item.dateRegister
              };
          });    
          
          if (mapped.length) {
            setRows(mapped);
            setFiltered(null);
          } else {
            console.warn("fetchParking: response:", response);
          }
          
        } catch (err) {
          console.error("fetchParking error:", err);
        } finally {
          setLoading(false);
        }
  };

  const filters: FilterField[] = [  
    { key: "vehicleSearch", label: "Buscar Veículo", 
      type: "text"
    }
  ];

  const columns: TableColumn<parkingServiceType>[] = [
      { key: "plate", label: "Placa" },
      { key: "color", label: "Cor" },
      { key: "entry", label: "Horário de entrada" },
      { key: "client", label: "Cliente" }
  ];

  const actions = [
      {
        key: "view",
        label: "Visualizar",
        icon: <PencilIcon size={14} />,
        className: 'icon-btn-view',
        onClick: (row: parkingServiceType) => {
          handleEdit(row);
        },
      },
      {
        key: "delete",
        label: "Deletar",
        icon: <TrashIcon size={14} />,
        className: 'icon-btn-delete',
        /*onClick: (row: parkingServiceType) => {
          handleDelete(String(row.idPriceTable!));
        },*/
      }
  ];

  const handleCreate = () => {
    setIsParkingServiceModalOpen(true);
  };

  const handleEdit = async (row: any) => {
    /*setParkingServiceDetail({
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
    });*/
    setIsParkingServiceModalOpen(true);
  };

  useEffect(() => {
    if(!isParkingServiceModalOpen) {
      setParkingServiceDetail(undefined);
    }
  }, [isParkingServiceModalOpen])
  
  const rowsToShow = filtered ?? rows;

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericTop title="Veiculos Estacionados" actionLabel="Estacionar Veiculo" onAction={handleCreate} onAction2={handleEdit} actionIcon={<UserIcon size={20} />} />
      <GenericFilters fields={filters} /*onSearch={handleSearch}*/ />
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
            title="Entrada e saída de veículos"
            columns={columns}
            rows={rowsToShow}
            actions={actions}
            perPage={5}
            total={rowsToShow.length}
            //onGenerateCSV={handleGenerateCSV}
          />
      }
    </main>
    {isParkingServiceModalOpen && <ParkingServiceModal isOpen={isParkingServiceModalOpen} closeModal={() => setIsParkingServiceModalOpen(false)} parkingService={parkingServiceDetail}/>}
  </>);
}