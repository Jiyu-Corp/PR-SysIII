## O que é PR SYS?
É uma sistema gerenciador, implementado para um estacionamento e suas entidades relacionadas:
- Serviço de entrada/saida de vêiculos
- Veiculos
- Clientes
- Convênios
- Tabelas de preço
- Tipo de veiculo
- Modelos de Ticket
---
## Como foi implementado?
A linguagem de programação utilizada foi o "Javascript", tanto no server-side como tambem no client-side. 

Vale dizer que o superset "Typescript" tambem foi utilizado em ambos os ambientes.
Especificamente, foram usado as bibliotecas/frameworks:
- NestJS(server-side)
  - TypeORM
- ReactJS(client-side)

Alem disto, o sistema tambem usa um banco de dados na nuvem, hospedado pela "Neon".

---
## O que é necessário para executar o projeto?
Requisitos:
- NodeJS
- npm

---
## Como executar?
OBS: Caso ja detenha do codigo fonte e das dependencias do projeto, pule para etapa 4.

### 1. Clone o repositorio.
```bash
git clone https://github.com/Jiyu-Corp/PR-SysIII.git
cd PR-SysIII
```

### 2. Baixe as dependencias do server e client.
```bash
cd app
cd frontend
npm i
cd ..

cd backend
npm i
cd ..
```

### 3. Duplique o arquivo .env.example, renomeie ele para .env, então preencha-o(Caso o arquivo .env não esteja na raiz da pasta "backend")
```bash
cd backend
# Copiar e colar o env exemplo, então preenche-la com os valores corretos.
cd ..
```

### 4. Rode o projeto. (execute este comando dentro da pasta app)
```bash
npm run start
```
