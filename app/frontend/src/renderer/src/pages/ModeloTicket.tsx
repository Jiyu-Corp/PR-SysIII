import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericFilters from "../components/Filters/Filters";
import ButtonModal from "@renderer/modals/ButtonModal/ButtonModal";
import GenericTable from "../components/Table/Table";
import { ArticleIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { Toaster, toast } from "react-hot-toast";
import TicketModelModal from "@renderer/modals/TicketModel/TicketModelModal";
import { ticketModelType } from "@renderer/types/resources/ticketModelType";
import { FilterField } from "@renderer/types/FilterTypes";
import { TableColumn } from "@renderer/types/TableTypes";
import { errorToastStyle, successToastStyle } from "@renderer/types/ToastTypes";
import { requestPRSYS } from '@renderer/utils/http'
import { Grid } from "react-loader-spinner";
import { getErrorMessage } from "@renderer/utils/utils";
import Swal from 'sweetalert2';
import { PrsysError } from "@renderer/types/prsysErrorType";

export default function ModeloTicketPage() {
  const navigate = useNavigate();
  const [isTicketModelModalOpen, setIsTicketModelModalOpen] = useState<boolean>(false);
  const [ticketModelDetail, setTicketModelDetail] = useState<ticketModelType | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  const [rows, setRows] = useState<ticketModelType[]>([]);
  const [filtered, setFiltered] = useState<ticketModelType[] | null>(null);

  const handleCreate = () => {
    setIsTicketModelModalOpen(true);
  };

  useEffect(() => {
    setLoading(true);

    fetchTicket();

    setLoading(false);
  }, []);

  const fetchTicket = async () => {
        setLoading(true);
        try {
          const response = await requestPRSYS('ticket-model', '', 'GET');
          
          const arr = Array.isArray(response) ? response : response?.data ?? [];
          
          const mapped: ticketModelType[] = (arr as any[]).map((item: any) => {
            return {
                idTicketModel: item.idTicketModel,
                name: item.name,
                header: item.header,
                footer: item.footer,
                dateregister: item.dateRegister.split('-').reverse().join('/'),
                dateUpdate: item.dateUpdate,
                isactive: item.isActive
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

  const filters: FilterField[] = [  
      { key: "ticketName", label: "Nome Modelo", 
        type: "text"
      },      
      {
        key: "dateregister",
        label: "Data inicial",
        type: "date"
      },
      {
        key: "dateUpdate",
        label: "Data final",
        type: "date"
      },
  ];
  
  const columns: TableColumn<ticketModelType>[] = [
      { key: "name", label: "Nome do modelo" },
      { key: "dateregister", label: "Data de Cadastro" },
      { key: "isactive", label: "Habilitada" , type:'switch', controlled: false,
        onToggle: (row, checked) => {
          return handleSwitch(row, checked);
        },
      }
  ];
  
  const actions = [
      {
        key: "view",
        label: "Visualizar",
        icon: <PencilIcon size={14} />,
        className: 'icon-btn-view',
        onClick: (row: ticketModelType) => {
          handleEdit(row);
        },
      },
      {
        key: "delete",
        label: "Excluir",
        icon: <TrashIcon size={14} />,
        className: 'icon-btn-delete',
        onClick: (row: ticketModelType) => {
          handleDelete(String(row.idTicketModel!));
        },
      }
  ];

  const handleSwitch = async (row: ticketModelType, checked: boolean): Promise<boolean> => {
      try {
        await requestPRSYS('ticket-model', `manageTicketModelActivity/${row.idTicketModel}`, 'PUT', {
          isActive: checked
        });
        toast.success(`Modelo de Ticket ${checked ? 'ativado' : 'desativado'} com sucesso!`, successToastStyle);
        return true;
      } catch (err) {
        toast.error(getErrorMessage(err as PrsysError), errorToastStyle);
        console.error("handleSwitch erro:", err);
        return false;
      }
  }

  const handleSearch = async (values: Record<string, any>) => {
      
      const ticketName = values.ticketName;
      const dateUpdate = values.dateUpdate ? String(values.dateUpdate) : null;
      const dateRegister = values.dateRegister ? String(values.dateRegister) : null;
      
      if (!ticketName && !dateUpdate && !dateRegister) {
        setFiltered(null);
        return;
      }
  
      setLoading(true);
      try {
        
        const params = {
          name: ticketName,
          dateRegisterStart: dateRegister?.split('/').reverse().join('-'),
          dateRegisterEnd: dateUpdate?.split('/').reverse().join('-')
        }
        
        const response = await requestPRSYS('ticket-model', '', 'GET', undefined, params);
        const arr = Array.isArray(response) ? response : response?.data ?? [];
        
        if(response.length < 1 || !response){
          toast.error('Nenhum dado para esses filtros', errorToastStyle);
        }
        
        const mapped: ticketModelType[] = (arr as any[]).map((item: any) => ({
            idTicketModel: item.idTicketModel,
            name: item.name,
            header: item.header,
            footer: item.footer,
            dateregister: item.dateRegister.split('-').reverse().join('/'),
            dateUpdate: item.dateUpdate,
            isactive: item.isActive
        }));
    
        setFiltered(mapped);
  
      } catch (err) {
        toast.error('Verifique os filtros para estarem no padrão correto', errorToastStyle);
        console.error("handleSearch erro:", err);
      } finally {
        setLoading(false);
      }
  };

  const handleEdit = async (row: any) => {
    setTicketModelDetail({
      idTicketModel: row.idTicketModel,
      name: row.name,
      header: row.header,
      footer: row.footer
    });
    setIsTicketModelModalOpen(true);
  };

  const handleDelete = async (id: string) => {
      try {
        const result = await Swal.fire({
          title: "Confirmação",
          text: "Tem certeza que deseja excluir este ticket?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Sim, excluir",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        });
  
        if (result.isConfirmed) {
          await requestPRSYS("ticket-model", `${id}`, "DELETE");
          toast.success("Ticket excluido com sucesso!", successToastStyle);
          fetchTicket();
        }
      } catch (error) {
        console.error("Erro ao desativar Ticket:", error);
        toast.error(getErrorMessage(error as PrsysError), errorToastStyle);
      }
  };

  useEffect(() => {
    if(!isTicketModelModalOpen) {
      setTicketModelDetail(undefined);
      fetchTicket();
    }
  }, [isTicketModelModalOpen])

  const handleGenerateCSV = () => {
    const data = (filtered ?? rows).map((r: any) => ({
      Nome: r.name,
      Cadastro: r.dateregister,
      Ativo: r.isactive ?? false ? "Sim" : "Não"
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
    a.download = `ticket.csv`;
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
      <GenericFilters title="Modelos Ticket" fields={filters} onSearch={handleSearch} buttons={[
        <ButtonModal key={0} text="Cadastrar Modelo de Ticket" action={handleCreate} color="#FFFFFF" backgroundColor="#3BB373" icon={ArticleIcon}/>
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
            title="Listagem de modelos de ticket"
            columns={columns}
            rows={rowsToShow}
            actions={actions}
            total={rowsToShow.length}
            onGenerateCSV={handleGenerateCSV}
          />
      }
    </main>
    {isTicketModelModalOpen && <TicketModelModal isOpen={isTicketModelModalOpen} closeModal={() => setIsTicketModelModalOpen(false)} ticketModel={ticketModelDetail}/>}
  </>);
}