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
import HelpModal from "@renderer/modals/HelpModal/HelpModal";
import { ArticleIcon } from "@phosphor-icons/react";

export default function EntradaSaidaPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  const [rows, setRows] = useState<reportType[]>([]);
  const [filtered, setFiltered] = useState<reportType[] | null>(null);

  function openHelpMenuWithF1(event: KeyboardEvent): void {
    if(event.key !== "F1") return;
    event.preventDefault();

    setIsHelpModalOpen(prev => !prev);
  }

  useEffect(() => {
    setLoading(true);

    window.addEventListener("keydown", openHelpMenuWithF1);

    fetchReportParking().then(() => setLoading(false));

    return () => {
      window.removeEventListener("keydown", openHelpMenuWithF1);
    }
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

  const actions = [
    {
      key: "view",
      label: "Ticket",
      icon: <ArticleIcon size={14} />,
      className: 'icon-btn-view',
      onClick: (row: reportType) => {
        console.log(row);
      },
    },
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
    
  const handleGeneratePDF = async () => {
    const data = (filtered ?? rows) as reportType[];
    if (!data || data.length === 0) {
      toast.error('Nenhum dado para gerar o relatório', errorToastStyle);
      return;
    }

    const formatDate = (d: string | undefined | null) => {
      if (!d) return '---';
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? String(d) : dt.toLocaleString();
    };

    const styles = `
      <style>
        @page { size: A4; margin: 18mm; }
        html,body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial; color: #222; }
        .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .title { font-size:16px; font-weight:600; }
        .main-title { margin-bottom: 8px; font-size: 32px; color: #000000ba;}
        .main-title--blue { font-size: 46px;color: #4A87E8;padding-right: 5px;font-weight: 400;margin-left: 12px}
        .meta { font-size:12px; color:#666; }
        table { width:100%; border-collapse:collapse; font-size:12px; }
        th, td { border:1px solid #ddd; padding:8px 10px; vertical-align:middle; }
        th { background:#4A87E8; color:white; text-align:left; }
        tr:nth-child(even) td { background:#fbfbfb; }
        .right { text-align:right; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
        .footer { margin-top:8px; font-size:11px; color:#555; }
      </style>
    `;

    const title = 'Relatório - Entradas / Saídas';
    const nowStr = new Date().toLocaleString();

    const headerHtml = `
      <div class="header">
        <div class="main-title">           
          <span class="main-title--blue">PR</span>
          <span class="main-title--black">sys</span>
        </div>
        <div>
          <div class="title">${title}</div>
          <div class="meta">Gerado em: ${nowStr}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Marca-Modelo-Ano</th>
            <th>Cliente</th>
            <th>Horário de entrada</th>
            <th>Horário de Saída</th>
            <th class="right">Preço</th>
          </tr>
        </thead>
        <tbody>
    `;

    const rowsHtml = data.map(r => {
      const price = typeof r.price === 'number' ? numeroParaMoeda(r.price) : (r.price ?? '---');
      return `
        <tr>
          <td>${(r.plate ?? '---')}</td>
          <td>${(r.brandModelYear ?? '---')}</td>
          <td>${(r.clientName ?? '---')}</td>
          <td>${formatDate(r.dateParkingServiceStart)}</td>
          <td>${formatDate(r.dateParkingServiceEnd)}</td>
          <td class="right">${price}</td>
        </tr>
      `;
    }).join('');

    const footerHtml = `
        </tbody>
      </table>
      <div class="footer">Total de registros: ${data.length}</div>
    `;

    const fullHtml = `<!doctype html><html><head><meta charset="utf-8">${styles}</head><body>${headerHtml}${rowsHtml}${footerHtml}</body></html>`;

    try {
      const result = await (window as any).electronAPI.generatePDF({ html: fullHtml, defaultFilename: 'relatorio-entradas-saidas.pdf' });
      if (result?.canceled) {
        toast('Exportação cancelada');
      } else {
        toast.success('PDF gerado em: ' + result.filePath);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao gerar PDF', errorToastStyle);
    }
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
      <GenericFilters title="Consultar" fields={filters} onSearch={handleSearch} style="header-flex-start"
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
            actions={actions}
            total={rowsToShow.length}
            onGenerateCSV={handleGeneratePDF}
            isReport={true}
          />
      }
    </main>
    {isHelpModalOpen && <HelpModal isOpen={isHelpModalOpen} closeModal={() => setIsHelpModalOpen(false)} helpIcon={ArticleIcon} 
      helpTitle="Relatorios" 
      helpText={
        `Nesta aba podemos consultar informações do sistema resumidas em listagens:\n`+
        `1. Selecionar o tipo da listagem na parte superior da tela.\n\n` +
        `2. Extrair relatorio com os dados consultados.`
      }/>
    }
	</>);
}