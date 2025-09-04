import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import GenericFilters from "../components/Filters/Filters";
import GenericTable from "../components/Table/Table";
import { UserIcon, PencilIcon, TrashIcon, CarIcon  } from "@phosphor-icons/react";
import { Toaster, toast } from "react-hot-toast";
import ParkingServiceModal from "@renderer/modals/ParkingServiceModal/ParkingServiceModal";
import { parkingServiceType } from "@renderer/types/resources/parkingServiceType";
import { FilterField } from "@renderer/types/FilterTypes";
import { TableColumn } from "@renderer/types/TableTypes";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { requestPRSYS } from '@renderer/utils/http'
import { Grid } from "react-loader-spinner";
import { formatDateTime, getErrorMessage } from "@renderer/utils/utils";
import Swal from 'sweetalert2';
import { PrsysError } from "@renderer/types/prsysErrorType";
import ButtonModal from "@renderer/modals/ButtonModal/ButtonModal";

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
              dateRegister: item.dateRegister,
              vehicle: item.vehicle,
              client: item.clientEntry ?? '---',
              clientName: item.clientEntry?.name ?? '---',
              plate: item.vehicle.plate,
              color: item.vehicle.color,
              entry: formatDateTime(new Date(item.dateRegister))
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
      { key: "clientName", label: "Cliente" }
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
        onClick: (row: parkingServiceType) => {
          handleDelete(String(row.idParkingService!));
        },
      }
  ];

  const handleSearch = (values: Record<string, any>) => {
    const vehicleSearch = (values.vehicleSearch ?? "").toString().trim();
  
    if (!vehicleSearch) {
      setFiltered(null);
      return;
    }
  
    setLoading(true);
    try {
      const query = vehicleSearch.toLowerCase();
      const tokens = query.split(/\s+/).filter(Boolean);
  
      const filteredRows = rows.filter((row) => {
        
        const vehicleAsString =
          row.vehicle && typeof row.vehicle === "object"
            ? Object.values(row.vehicle).filter(Boolean).join(" ")
            : String(row.vehicle ?? "");
  
        const searchable = [
          row.vehicle.plate,
          row.client?.name,
          row.vehicle.color,
          vehicleAsString,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
  
        return tokens.every((t) => searchable.includes(t));
      });
  
      if (!filteredRows.length) {
        toast.error("Nenhum dado para esses filtros", errorToastStyle);
      }
  
      setFiltered(filteredRows);
    } catch (err) {
      console.error("handleSearch erro (frontend):", err);
      toast.error("Verifique os filtros para estarem no padrão correto", errorToastStyle);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = () => {
    setIsParkingServiceModalOpen(true);
  };

  const handleEdit = async (row: any) => {
    setParkingServiceDetail({
      idParkingService: row.idParkingService,
      dateRegister: row.dateRegister,
      vehicle: {
        idVehicle: row.vehicle.idVehicle,
        plate: row.vehicle.plate,
        model: {
          idModel: row.vehicle.model.idModel,
          nameModel: row.vehicle.model.name,
          idVehicleType: row.vehicle.model.vehicleType.idVehicleType,
          idBrand: row.vehicle.model.brand.idBrand,
          brand: {
            idBrand: row.vehicle.model.brand.idBrand,
            nameBrand: row.vehicle.model.brand.name
          }
        },
        year: row.vehicle.year,
        color: row.color,    
        idClient: row.client ?? undefined
      },
      client: {
        idClient: row.client?.idClient,
        cpfCnpj: row.client?.cpfCnpj,
        name: row.client?.name,
        phone: row.client?.phone,
        email: row.client?.email,
        enterprise: {
          idClient: row.client?.clientEnterprise?.idClient,
          name: row.client?.clientEnterprise?.name,
        } 
      }
    });
    setIsParkingServiceModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Confirmação",
        text: "Tem certeza que deseja excluir esta entrada?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim, excluir",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await requestPRSYS("parking-service", `${id}`, "DELETE");
        toast.success("Entrada excluída com sucesso!", successToastStyle);
        fetchEntradaSaida();
      }
    } catch (error) {
      console.error("Erro ao Entrada tabela:", error);
      toast.error(getErrorMessage(error as PrsysError), errorToastStyle);
    }
  };
  
  const handleGenerateCSV = () => {
    const data = (filtered ?? rows).map((r: any) => ({
      Placa: r.plate,
      Cor: r.color,
      Horario: r.entry,
      Cliente: r.clientName
    }));

    const csv = [
      Object.keys(data[0]).join(";"),
      ...data.map((row) => Object.values(row).map((v) => `"${String(v ?? "")}"`).join(";")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `entrada_saida.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if(!isParkingServiceModalOpen) {
      setParkingServiceDetail(undefined);
      fetchEntradaSaida();
    }
  }, [isParkingServiceModalOpen])
  
  const rowsToShow = filtered ?? rows;

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericFilters title="Veiculos Estacionados" fields={filters} onSearch={handleSearch} buttons={[
        <ButtonModal key={0} text="Estacionar Veiculo" action={handleCreate} color="#FFFFFF" backgroundColor="#3BB373" icon={CarIcon}/>
      ]}/>
      {loading 
        ? <div style={{ margin: "24px 64px" }}>
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
        : <GenericTable
            title="Entrada e saída de veículos"
            columns={columns}
            rows={rowsToShow}
            actions={actions}
            perPage={5}
            total={rowsToShow.length}
            onGenerateCSV={handleGenerateCSV}
          />
      }
    </main>
    {isParkingServiceModalOpen && <ParkingServiceModal isOpen={isParkingServiceModalOpen} closeModal={() => setIsParkingServiceModalOpen(false)} parkingService={parkingServiceDetail}/>}
  </>);
}