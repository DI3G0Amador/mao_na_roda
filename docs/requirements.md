# Planejamento Técnico e Especificação de Requisitos - Mão na Roda (Gestão de Oficinas)

## 1. Objetivo do Sistema
Desenvolver uma plataforma web/mobile em nuvem, escalável e sob a arquitetura **Multi-Tenant** (com isolamento estrito de dados por oficina via Supabase Row-Level Security), voltada para a gestão simplificada de oficinas mecânicas, centros automotivos e auto elétricas.

O objetivo do **Mão na Roda** é eliminar a papelada física no pátio, acelerar o fluxo de atendimento em até 3x através de um assistente wizard mobile, registrar vistorias fotográficas de entrada (evitando disputas de avarias) e permitir o envio instantâneo de orçamentos e status da Ordem de Serviço (O.S.) diretamente no WhatsApp do cliente.

---

## 2. Usuários e Atores do Sistema (Acessos)
* **Dono da Oficina / Administrador:** Acesso global irrestrito à gestão de cadastros, controle financeiro, histórico de faturamento e configuração de funcionários.
* **Mecânico / Técnico de Pátio:** Acesso via dispositivo móvel para abertura de vistoria rápida, captura de fotos do veículo, diagnóstico técnico e atualização dos status das Ordens de Serviço.
* **Recepcionista / Atendente:** Cadastro de clientes e veículos, geração de orçamentos, gerenciamento do estoque de peças e envio de mensagens no WhatsApp.
* **Cliente Final (Proprietário do Veículo):** Visualização externa e aprovação digital do orçamento enviado por link dinâmico via WhatsApp.

---

## 3. Problemas Identificados a Resolver
1. **Lentidão e Perda de Ordens de Serviço:** Uso de fichas de papel rasuradas ou blocos físicos que dificultam a localização do histórico do veículo.
2. **Disputas de Avarias Pré-Existentes:** Clientes que alegam que arranhões, mossas ou falta de acessórios ocorreram dentro da oficina por falta de vistoria registrada na entrada.
3. **Comunicação Fragmentada e Atraso em Aprovações:** Dificuldade em contatar o cliente por ligação para aprovação de orçamento de peças extras, gerando veículos parados no pátio.
4. **Descontrole de Estoque e Aplicação de Peças:** Ausência de baixa automática de estoque de peças utilizadas na O.S., resultando em falta de componentes no momento da execução.
5. **Perda de Prazos de Garantia:** Dificuldade em rastrear garantias legais (ex: 90 dias) e histórico por Placa/KM para atendimento de retornos de serviço.

---

## 4. Requisitos Funcionais (RF)

### Módulo: Core, Autenticação & Multitenancy
* **[RF-01] Isolamento por Oficina (RLS):** Garantir isolamento estrito por `oficina_id` em todas as tabelas (clientes, veículos, peças e O.S.) utilizando políticas de *Row-Level Security* (RLS) no Supabase.
* **[RF-02] Autenticação de Usuários:** Autenticar usuários operacionais vinculados ao cadastro da própria oficina com funções restritas (`admin`, `mecanico`, `recepcao`).

### Módulo: Gestão de Clientes e Veículos
* **[RF-03] Cadastro Rápido de Cliente:** Permitir o cadastro simplificado de clientes (Nome, WhatsApp obrigatório com máscara, CPF/CNPJ).
* **[RF-04] Cadastro e Histórico por Veículo:** Vincular veículos a clientes por Placa (padrão Mercosul ou antigo), Modelo, Marca, Ano, Cor e registro do KM atual.
* **[RF-05] Busca Instantânea por Placa:** Oferecer busca por placa com autocompletar na recepção do veículo.

### Módulo: Wizard de Abertura e Vistoria Fotográfica
* **[RF-06] Assistente de Abertura de O.S. (Wizard):** Conduzir a abertura da O.S. em etapas fluídas otimizadas para smartphones.
* **[RF-07] Vistoria Fotográfica de Entrada:** Permitir o upload/captura imediata de fotos categorizadas do veículo (Avarias/Arranhões, Painel com Odômetro/KM, Pneus e Visão Geral).
* **[RF-08] Registro de Defeito Relatado e Diagnóstico:** Registrar a queixa inicial informada pelo cliente e o parecer técnico preliminar do mecânico.

### Módulo: Detalhamento da O.S. e Estoque
* **[RF-09] Adição Dinâmica de Itens (Peças e Serviços):** Permitir inclusão de mão de obra e peças com cálculo automático de subtotal e total da O.S.
* **[RF-10] Baixa e Alerta de Estoque:** Atualizar a quantidade disponível no módulo de peças ao adicionar componentes na O.S.
* **[RF-11] Gestão de Status Operacional:** Transição de estados da O.S. (`em_diagnostico`, `aguardando_peca`, `aguardando_aprovacao`, `em_execucao`, `concluido`, `cancelado`).
* **[RF-12] Cálculo Automático de Garantia:** Gerar automaticamente a data limite da garantia legal de 90 dias ao concluir uma O.S.

### Módulo: Comunicação WhatsApp & Notificações
* **[RF-13] Disparo de Orçamento via WhatsApp:** Formatar e enviar mensagem padronizada no WhatsApp com resumo do orçamento, link para visualização e QR Code Pix.
* **[RF-14] Notificação de Veículo Pronto:** Disparar aviso automático no WhatsApp do cliente assim que a O.S. for alterada para o status `concluido`.

### Módulo: Dashboard & Indicadores Operacionais
* **[RF-15] Painel de Controle de Pátio:** Exibir contadores em tempo real do número de veículos no pátio por status.
* **[RF-16] Métricas de Desempenho:** Exibir Faturamento do Mês, Ticket Médio por O.S. e taxa de aprovação de orçamentos.

---

## 5. Requisitos Não Funcionais (RNF)

* **[RNF-01] Interface Mobile-First PWA:** O sistema deve possuir navegação otimizada para telas sensíveis ao toque (menus inferiores fixos, *bottom sheets* para formulários e botões amplos para uso na oficina).
* **[RNF-02] Tempo de Resposta e Desempenho:** Operações de busca de placa e alternância de status da O.S. devem ser executadas em menos de 800ms.
* **[RNF-03] Segurança no Banco de Dados:** Aplicar a função `get_user_oficina_id()` no PostgreSQL para impedir que uma oficina acesse registros de outra, mesmo em requisições diretas via API.
* **[RNF-04] Armazenamento Seguro de Imagens:** Fotos da vistoria devem ser armazenadas no Supabase Storage com links vinculados à O.S. correspondente.
* **[RNF-05] Resiliência de Conexão:** Manter cache local temporário de dados do formulário durante o preenchimento da vistoria no pátio.

---

## 6. Regras de Negócio (RN)

* **[RN-01] Validação Obrigatoriedade do WhatsApp:** É proibido cadastrar clientes ou abrir O.S. sem um número de WhatsApp válido (mínimo 8 dígitos).
* **[RN-02] Unicidade da Placa no Sistema:** A placa do veículo é a chave principal de acompanhamento no pátio; não podem existir dois veículos com a mesma placa vinculados à mesma oficina.
* **[RN-03] Impeditivo de Peça Sem Estoque:** Se uma peça selecionada possuir quantidade zero no estoque, o sistema deve exibir alerta e alterar a O.S. para o status `aguardando_peca`.
* **[RN-04] Garantia Legal de 90 Dias:** Por padrão CDC, toda O.S. encerrada gera um período de garantia de 90 dias a contar da data de conclusão.
* **[RN-05] Preservação de Fotos de Vistoria:** As fotos capturadas na entrada do veículo não podem ser excluídas após a aprovação do orçamento pelo cliente.

---

## 7. Roadmap & Dúvidas de Integração
1. **Integração com Gateway de Pagamento:** Avaliar a inclusão do Asaas ou Mercado Pago para geração de QR Code Pix direto no link do WhatsApp.
2. **Consulta Automática de Placa (API FIPE/SINETRAN):** Estudar integração de API para autopreenchimento de Marca/Modelo/Ano ao digitar a placa.
3. **Assinatura Digital no Celular:** Avaliar adição de campo para o cliente assinar o termo de vistoria com o dedo na tela do celular do mecânico.
