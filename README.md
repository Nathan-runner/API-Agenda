
# API-Agenda

O **API-Agenda** é o motor de backend desenvolvido para suportar sistemas de agendamento e gestão de serviços. Esta API RESTful foi projetada para ser robusta, escalável e de fácil integração, lidando com toda a persistência de dados e regras de negócio necessárias para o controlo de horários.

## 🚀 Sobre o Projeto

Este repositório contém a lógica de servidor que alimenta aplicações de agendamento (como o *Agendify Beauty*). A API gere o fluxo de dados entre o utilizador e a base de dados, garantindo que conflitos de horários sejam evitados e que as informações dos clientes sejam armazenadas de forma segura e organizada.

## 🛠️ Tecnologias Utilizadas

A stack tecnológica foi escolhida para garantir alta performance e integridade relacional:

* **Runtime:** Node.js
* **Framework:** Express.js
* **Banco de Dados:** PostgreSQL (Relacional)
* **Integração Cloud:** Preparado para Supabase / Render
* **Segurança:** Variáveis de ambiente com `dotenv`

## 📋 Funcionalidades Principais

* **Gestão de Agendamentos (CRUD):** Criação, leitura, atualização e eliminação de compromissos.
* **Relacionamento de Dados:** Estrutura vinculando clientes, profissionais e serviços.
* **Endpoints Escaláveis:** Arquitetura de rotas limpa para fácil manutenção.
* **Persistência Segura:** Configuração otimizada para bases de dados PostgreSQL.

## 🔧 Instalação e Execução

Para configurar o ambiente de desenvolvimento localmente:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Nathan-runner/API-Agenda.git
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd API-Agenda
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto e configure as credenciais da sua base de dados:
    ```env
    DB_HOST=seu_host
    DB_USER=seu_usuario
    DB_PASS=sua_senha
    DB_NAME=seu_nome_db
    PORT=3000
    ```

5.  **Inicie o servidor (Modo dev):**
    ```bash
    npm run dev
    ```

## 🛣️ Estrutura de Endpoints (Exemplos)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/agendamentos` | Retorna todos os horários marcados |
| `POST` | `/agendamentos` | Cria um novo agendamento no sistema |
| `PUT` | `/agendamentos/:id` | Atualiza os dados de um agendamento existente |
| `DELETE` | `/agendamentos/:id` | Remove um agendamento da base de dados |


> **Nota:** Esta API é um componente fundamental para a modernização de fluxos de trabalho manuais, oferecendo uma base sólida para qualquer interface de agendamento.
