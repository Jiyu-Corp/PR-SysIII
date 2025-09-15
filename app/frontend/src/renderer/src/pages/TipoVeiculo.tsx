import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import ButtonModal from "@renderer/modals/ButtonModal/ButtonModal";
import GenericTable from "../components/Table/Table";
import { CarIcon,  PencilIcon, TrashIcon, CarProfileIcon, JeepIcon, MotorcycleIcon, TruckIcon } from "@phosphor-icons/react";
import { Toaster, toast } from "react-hot-toast";
import VehicleTypeModal from "@renderer/modals/VehicleTypeModal/VehicleTypeModal";
import { vehicleTypeType } from "@renderer/types/resources/vehicleTypeType";
import { FilterField } from "@renderer/types/FilterTypes";
import { TableColumn } from "@renderer/types/TableTypes";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { requestPRSYS } from '@renderer/utils/http'
import { Grid } from "react-loader-spinner";
import { getErrorMessage } from "@renderer/utils/utils";
import Swal from 'sweetalert2';
import { PrsysError } from "@renderer/types/prsysErrorType";

export default function TipoVeiculoPage() {
  const navigate = useNavigate();
  const [isVehicleTypeModalOpen, setIsVehicleTypeModalOpen] = useState<boolean>(false);
  const [vehicleTypeDetail, setVehicleTypeDetail] = useState<vehicleTypeType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState<vehicleTypeType[]>([]);

  const vehicleTypeImages = [
    { idImage: 1, icon: CarProfileIcon },
    { idImage: 2, icon: MotorcycleIcon },
    { idImage: 3, icon: JeepIcon },
    { idImage: 4, icon: TruckIcon },
  ]

  const handleCreate = () => {
    setIsVehicleTypeModalOpen(true);
  };

  useEffect(() => {
    setLoading(true);

    fethTipoVeiculo();

    setLoading(false);
  }, []);

  const fethTipoVeiculo = async () => {
      setLoading(true);
      try {
        const response = await requestPRSYS('vehicle-type', '', 'GET');

        const arr = Array.isArray(response) ? response : response?.data ?? [];
        
        const mapped: vehicleTypeType[] = (arr as any[]).map((item: any) => {
          return {
              idVehicleType: item.idVehicleType,
              description: item.description,
              idImage: item.idImage
            };
        });    
        
        if (mapped.length) {
          setRows(mapped);
        } else {
          setRows([]);
          console.warn("fetchPrice: response:", response);
        }
        
      } catch (err) {
        console.error("fetchPrice error:", err);
      } finally {
        setLoading(false);
      }
  };

  const columns: TableColumn<vehicleTypeType>[] = [
      { key: "description", label: "Tipo de Veículo" },
      { key: 'idImage', label: "Ícone" , render: (row: vehicleTypeType) => {
        const img = vehicleTypeImages.find(v => v.idImage === row.idImage);
        const Icon = img?.icon || CarProfileIcon;
        return <Icon size={20} />;
      }},
  ];

  const actions = [
      {
        key: "view",
        label: "Visualizar",
        icon: <PencilIcon size={14} />,
        className: 'icon-btn-view',
        onClick: (row: vehicleTypeType) => {
          handleEdit(row);
        },
      },
      {
        key: "delete",
        label: "Excluir",
        icon: <TrashIcon size={14} />,
        className: 'icon-btn-delete',
        onClick: (row: vehicleTypeType) => {
          handleDelete(String(row.idVehicleType!));
        },
      }
  ];

  const handleEdit = async (row: any) => {
    setVehicleTypeDetail({
      idVehicleType: row.idVehicleType,
      description: row.description,
      idImage: row.idImage
    });
    setIsVehicleTypeModalOpen(true);
  };

  const handleDelete = async (id: string) => {
      try {
        const result = await Swal.fire({
          title: "Confirmação",
          text: "Tem certeza que deseja excluir este tipo de veículo?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Sim, excluir",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        });
  
        if (result.isConfirmed) {
          await requestPRSYS("vehicle-type", `${id}`, "DELETE");
          toast.success("Tipo veículo excluído", successToastStyle);
          fethTipoVeiculo();
        }
      } catch (error) {
        console.error("Erro ao desativar tipo de veículo:", error);
        toast.error(getErrorMessage(error as PrsysError), errorToastStyle);
      }
  };

  useEffect(() => {
    if(!isVehicleTypeModalOpen) {
      setVehicleTypeDetail(undefined);
      fethTipoVeiculo();
    }
  }, [isVehicleTypeModalOpen])

  
  const handleGenerateCSV = () => {
    const data = rows.map((r: any) => ({
      Descrição: r.description
    }));
  
    if (!data.length) return;
  
    const escapeValue = (v: any) =>
      `"${String(v ?? "").replace(/"/g, '""')}"`;
  
    const header = Object.keys(data[0]).map((h) => escapeValue(h)).join(";");
    const body = data
      .map((row) => Object.values(row).map((v) => escapeValue(v)).join(";"))
      .join("\n");
  
    const csv = `${header}\n${body}`;
  
    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tipoveiculo.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericTop title="Tipo de Veículo" actionLabel="Cadastrar Tipo de Veículo" onAction={handleCreate} actionIcon={<CarIcon size={20} />} /> 
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
            title="Listagem de Tipo de Veículo"
            columns={columns}
            rows={rows}
            actions={actions}
            total={rows.length}
            onGenerateCSV={handleGenerateCSV}
          />
      }
    </main>
    {isVehicleTypeModalOpen && <VehicleTypeModal isOpen={isVehicleTypeModalOpen} closeModal={() => setIsVehicleTypeModalOpen(false)} vehicleType={vehicleTypeDetail}/>}
  </>);
}