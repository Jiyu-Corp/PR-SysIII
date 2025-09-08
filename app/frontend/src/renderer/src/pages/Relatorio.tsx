import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericFilters from "../components/Filters/Filters";
import GenericTable from "../components/Table/Table";
import { Toaster, toast } from "react-hot-toast";
import { FilterField } from "@renderer/types/FilterTypes";
import { TableColumn } from "@renderer/types/TableTypes";
import { reportType } from "@renderer/types/resources/reportType";
import { errorToastStyle } from "@renderer/types/ToastTypes";
import { numeroParaMoeda } from "@renderer/utils/utils";
import { requestPRSYS } from '@renderer/utils/http'
import { Grid } from "react-loader-spinner";
import { SelectOption, SelectOptionGroup } from "@renderer/types/ReactSelectTypes";
import SelectModal from "../modals/SelectModal/SelectModal";

export default function EntradaSaidaPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState<reportType[]>([]);
  const [filtered, setFiltered] = useState<reportType[] | null>(null);

  useEffect(() => {
    setLoading(true);

    fetchReportParking().then(() => setLoading(false));
  }, []);

  const fetchReportParking = async () => {
      setLoading(true);
      try {
        const response = await requestPRSYS('report', 'parkedServices', 'GET');
        
        const arr = Array.isArray(response) ? response : response?.data ?? [];
				
        const mapped: reportType[] = (arr as any[]).map((item: any) => {
          return {
							clientName: item.clientName ?? '---',
							brandModelYear: item.brandModelYear,
							dateParkingServiceEnd: item.dateParkingServiceEnd,
							dateParkingServiceStart: item.dateParkingServiceStart,
							plate: item.plate, 
							price: numeroParaMoeda(item.price)
            };
        });    
        
        if (mapped.length) {
          setRows(mapped);
          setFiltered(null);
        } else {
          setRows([]);
          setFiltered(null);
          console.warn("fetchReport: response:", response);
        }
        
      } catch (err) {
        console.error("fetchReport error:", err);
      } finally {
        setLoading(false);
      }
  };

  const filters: FilterField[] = [  
      { key: "plate", label: "Placa", 
        type: "text"
			},
      { key: "clientName", label: "Nome Cliente", 
        type: "text"
			},
			{ key: "dateParkingServiceStart", label: "Data Inicial", 
				type: "date"
			},
			{ key: "dateParkingServiceEnd", label: "Data Final", 
				type: "date"
			},
  ];

  const columns: TableColumn<reportType>[] = [
      { key: "plate", label: "Placa" },
      { key: "brandModelYear", label: "Marca-Modelo-Ano" },
      { key: "clientName", label: "Cliente" },
      { key: "dateParkingServiceStart", label: "Horário de entrada" },
      { key: "dateParkingServiceEnd", label: "Horário de Saída" },
      { key: "price", label: "Preço" }
  ];

	const handleSearch = async (values: Record<string, any>) => {
		
		const plate = values.plate;
		const dateStart = values.dateParkingServiceStart;
		const dateEnd = values.dateParkingServiceEnd;
		const clientName = values.clientName;
		
		if (!plate && !dateStart && !dateEnd && !clientName) {
			setFiltered(null);
			return;
		}

		setLoading(true);
		try {
			
			const params = {
				plate: plate?.toUpperCase(),
				dateStart: dateStart,
				dateEnd: dateEnd,
				clientName: clientName ?? undefined
			}
			
			const response = await requestPRSYS('report', 'parkedServices', 'GET', undefined, params);
			const arr = Array.isArray(response) ? response : response?.data ?? [];
			
			if(response.length < 1 || !response){
				toast.error('Nenhum dado para esses filtros', errorToastStyle);
			}
			
			const mapped: reportType[] = (arr as any[]).map((item: any) => ({
					clientName: item.clientName,
					brandModelYear: item.brandModelYear,
					dateParkingServiceEnd: item.dateParkingServiceEnd,
					dateParkingServiceStart: item.dateParkingServiceStart,
					plate: item.plate, 
					price: item.price
			}));
	
			setFiltered(mapped);

		} catch (err) {
			toast.error('Verifique os filtros para estarem no padrão correto', errorToastStyle);
			console.error("handleSearch erro:", err);
		} finally {
			setLoading(false);
		}
	};
    
  const handleGenerateCSV = () => {
    const data = (filtered ?? rows).map((r: any) => ({
      Placa: r.plate,
      Entrada: r.dateParkingServiceStart,
      Saida: r.dateParkingServiceEnd,
      Cliente: r.clientName,
      Preço: r.price,
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
    a.download = `relatorios.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const rowsToShow = filtered ?? rows;
  const teste = [({
          id: 1,
          label: 'Entradas / Saídas' 
        } as SelectOption)];
	
  return (<>
    <main>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <GenericFilters title="Relatórios" fields={filters} onSearch={handleSearch} style="header-flex-start"
        buttons={[
          <div style={{width: "100%", display: "flex"}}>
            <SelectModal width="240px" placeholder='Entradas / Saídas' options={teste} value={'teste'} setValue={() => teste} />
          </div>]}      
      />
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
            title="Entradas/saídas"
            columns={columns}
            rows={rowsToShow}
            perPage={5}
            total={rowsToShow.length}
            onGenerateCSV={handleGenerateCSV}
          />
      }
    </main>
	</>);
}