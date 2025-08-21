// ClientesPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTop from "../components/TopContainer/TopContainer";
import GenericFilters from "../components/Filters/Filters";
import GenericTable from "../components/Table/Table";
import { UserIcon , PencilSimpleIcon, MagnifyingGlassIcon, CurrencyDollarIcon } from "@phosphor-icons/react"; // optional
import ModalWrapper from "@renderer/modals/ModalWrapper/ModalWrapper";
import ClienteModal from "@renderer/modals/ClienteModal/ClienteModal";

type ClientRow = {
  id: string;
  name: string;
  cpf: string;
  phone?: string;
  email?: string;
  company?: string;
  status?: "active" | "inactive";
};

type FilterField = {
  key: string;
  label?: string;
  type?: "text" | "select" | "date" | "number";
  placeholder?: string;
  default?: string;
  options?: { value: string; label: string }[];
};

type TableColumn<T> = {
  key: string;
  label: string;
  placeholder?: string;
  render?: (row: T) => React.ReactNode;
};

// --- Dummy rows (replace with API data) ---
const SAMPLE_ROWS: ClientRow[] = [
  {
    id: "1",
    name: "João Silva",
    cpf: "131.200.739-64",
    phone: "(42) 9 9981-3748",
    email: "joao@ex.com",
    company: "Orsted Corp",
    status: "active",
  },
  {
    id: "2",
    name: "Maria Souza",
    cpf: "987.654.321-00",
    phone: "(41) 9 9123-4567",
    email: "maria@ex.com",
    company: "Acme Ltd",
    status: "inactive",
  },
];

// --- Page component ---
export default function ClientesPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ClientRow[]>(SAMPLE_ROWS);
  const [filtered, setFiltered] = useState<ClientRow[] | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Filters config (pass to GenericFilters)
  const filters: FilterField[] = [  
    { key: "cpf", label: "CPF/CNPJ", type: "text", placeholder: "Digite o CPF/CNPJ" },
    { key: "name", label: "Nome", type: "text", placeholder: "Digite o nome" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Ativo" },
        { value: "inactive", label: "Inativo" },
      ],
    },
  ];

  // Table columns (pass to GenericTable)
  const columns: TableColumn<ClientRow>[] = [
    { key: "name", label: "Nome" },
    { key: "cpf", label: "CPF/CNPJ" },
    { key: "phone", label: "Telefone" },
    { key: "email", label: "Email" },
    { key: "company", label: "Empresa" },
    {
      key: "status",
      label: "Status",
      render: (r) => <span className={`px-2 py-0.5 rounded text-xs ${r.status === "active" ? "bg-emerald-100" : "bg-gray-200"}`}>{r.status}</span>,
    },
  ];

  // Actions for table rows (pass to GenericTable)
  const actions = [
    {
      key: "view",
      label: "Visualizar",
      icon: <MagnifyingGlassIcon size={14} />,
      onClick: (row: ClientRow) => {
        navigate(`/clientes/${row.id}`);
      },
    },
    {
      key: "edit",
      label: "Editar",
      icon: <PencilSimpleIcon size={14} />,
      onClick: (row: ClientRow) => {
        navigate(`/clientes/${row.id}/edit`);
      },
    },
    {
        key: 'money',
        label: 'Dinheiro',
        icon: <CurrencyDollarIcon size={14} />,
        onClick: (row: ClientRow) => {
            navigate(`/clientes/${row.id}/money`);
        }
    }
  ];

  // Called by GenericFilters -> onSearch (the GenericFilters should call this with the filter object)
  const handleSearch = (values: Record<string, any>) => {
    // simple client-side filter example:
    const filteredRows = rows.filter((r) => {
      if (values.cpf && !r.cpf.includes(values.cpf)) return false;
      if (values.name && !r.name.toLowerCase().includes(String(values.name).toLowerCase())) return false;
      if (values.status && r.status !== values.status) return false;
      return true;
    });
    setFiltered(filteredRows);
  };

  const handleCreate = () => {
    setIsOpen(true);
  };

  const handleGenerateCSV = () => {
    const data = (filtered ?? rows).map((r) => ({
      Nome: r.name,
      CPF: r.cpf,
      Telefone: r.phone,
      Email: r.email,
      Empresa: r.company,
      Status: r.status,
    }));
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).map((v) => `"${String(v ?? "")}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rowsToShow = filtered ?? rows;

  return (<>
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <main className="flex-1 p-6">
          <GenericTop title="Clientes" actionLabel="Cadastrar Cliente" onAction={handleCreate} actionIcon={<UserIcon size={20} />} />
          <GenericFilters fields={filters} onSearch={handleSearch} />
          <GenericTable
            title="Listagem de Clientes"
            columns={columns}
            rows={rowsToShow}
            actions={actions}
            perPage={5}
            total={rows.length}
            onGenerateCSV={handleGenerateCSV}
          />
        </main>
      </div>
    </div>
    <ClienteModal isOpen={isOpen} closeModal={() => setIsOpen(false)} client={undefined}/>
  </>);
}
