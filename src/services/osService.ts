import { OrdemServico, Cliente, Peca, DashboardStats, Oficina, UsuarioOficina } from '@/types';
import { calculateWarrantyDate } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const LOCAL_STORAGE_KEY = 'mao_na_roda_os_list_v2';
const LOCAL_STORAGE_PARTS = 'mao_na_roda_parts_v2';
const LOCAL_STORAGE_CLIENTS = 'mao_na_roda_clients_v2';
const LOCAL_STORAGE_OFICINA_ACTIVE = 'mao_na_roda_active_oficina';
const LOCAL_STORAGE_OFICINAS_LIST = 'mao_na_roda_oficinas_list_v2';
const LOCAL_STORAGE_USER_ACTIVE = 'mao_na_roda_active_user';
const LOCAL_STORAGE_USERS_LIST = 'mao_na_roda_users_list_v2';

export const INITIAL_OFICINAS: Oficina[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    nome: 'Oficina Rústica Auto Center',
    slug: 'oficina-rustica',
    whatsapp: '5511988776655',
    endereco: 'Av. dos Automóveis, 1500 - São Paulo, SP',
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    nome: 'Garagem Central Motores',
    slug: 'garagem-central',
    whatsapp: '5511977665544',
    endereco: 'Rua das Oficinas, 420 - Campinas, SP',
  },
];

export const INITIAL_USERS: (UsuarioOficina & { senhaHash?: string })[] = [
  {
    id: 'u-1',
    oficina_id: INITIAL_OFICINAS[0].id,
    nome: 'Roberto da Silva',
    email: 'admin@oficinarustica.com',
    funcao: 'admin',
    senhaHash: '123456',
  },
];

export const MOCK_CLIENTS: Cliente[] = [
  { id: 'cli-1', oficina_id: INITIAL_OFICINAS[0].id, nome: 'Carlos Eduardo Santos', whatsapp: '5511988776655', telefone: '(11) 98877-6655', cpf_cnpj: '234.567.890-11' },
  { id: 'cli-2', oficina_id: INITIAL_OFICINAS[0].id, nome: 'Fernanda Oliveira', whatsapp: '5511977665544', telefone: '(11) 97766-5544', cpf_cnpj: '345.678.901-22' },
  { id: 'cli-3', oficina_id: INITIAL_OFICINAS[1].id, nome: 'Marcos Vinícius Barbosa', whatsapp: '5511966554433', telefone: '(11) 96655-4433', cpf_cnpj: '456.789.012-33' },
  { id: 'cli-4', oficina_id: INITIAL_OFICINAS[1].id, nome: 'Transportadora Silva Ltd', whatsapp: '5511955443322', telefone: '(11) 95544-3322', cpf_cnpj: '12.345.678/0001-90' },
];

export const MOCK_PECAS: Peca[] = [
  { id: 'p-1', oficina_id: INITIAL_OFICINAS[0].id, nome: 'Óleo Sintético 5W30 1L (Havoline)', codigo_sku: 'OLE-5W30-01', preco_unitario: 58.00, quantidade_estoque: 24 },
  { id: 'p-2', oficina_id: INITIAL_OFICINAS[0].id, nome: 'Filtro de Óleo (Mann Filter)', codigo_sku: 'FIL-OLE-02', preco_unitario: 38.50, quantidade_estoque: 12 },
  { id: 'p-3', oficina_id: INITIAL_OFICINAS[0].id, nome: 'Jogo de Pastilhas de Freio Dianteira (Cobreq)', codigo_sku: 'PAS-FRE-03', preco_unitario: 145.00, quantidade_estoque: 8 },
  { id: 'p-4', oficina_id: INITIAL_OFICINAS[1].id, nome: 'Disco de Freio Ventilação Dupla (Fremax)', codigo_sku: 'DIS-FRE-04', preco_unitario: 290.00, quantidade_estoque: 4 },
  { id: 'p-5', oficina_id: INITIAL_OFICINAS[1].id, nome: 'Kit Correia Dentada + Tensor (Gates)', codigo_sku: 'KIT-COR-05', preco_unitario: 280.00, quantidade_estoque: 5 },
];

const INITIAL_MOCK_OS: OrdemServico[] = [
  {
    id: 'OS-2026-001',
    oficina_id: INITIAL_OFICINAS[0].id,
    cliente: MOCK_CLIENTS[0],
    veiculo: {
      id: 'v-1',
      oficina_id: INITIAL_OFICINAS[0].id,
      placa: 'BRA-2E19',
      modelo: 'Volkswagen Gol 1.6 MSI Flex',
      marca: 'Volkswagen',
      ano: '2021',
      km_atual: 54300,
      cor: 'Cinza Platinum',
    },
    status: 'em_diagnostico',
    defeito_relatado: 'Ruído metálico forte ao acionar o freio dianteiro e luz da injeção acesa ocasionalmente.',
    diagnostico_tecnico: 'Pastilhas de freio gastas até o elemento metálico de aviso. Necessário substituição do jogo e sangria.',
    valor_total: 480.00,
    garantia_dias: 90,
    data_garantia_limite: calculateWarrantyDate('2026-07-25', 90),
    data_abertura: '2026-07-25T10:30:00.000Z',
    vistorias: [
      {
        id: 'vis-1',
        url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
        categoria: 'avaria',
        descricao: 'Riscos leves no para-choque dianteiro lado esquerdo',
        data_criacao: '2026-07-25T10:35:00.000Z',
      },
    ],
    itens: [
      { id: 'it-1', tipo: 'peca', descricao: 'Jogo de Pastilhas de Freio Dianteira (Cobreq)', quantidade: 1, valor_unitario: 145.00, valor_total: 145.00 },
      { id: 'it-3', tipo: 'servico', descricao: 'Mão de Obra: Troca de pastilhas e limpeza do sistema de freio', quantidade: 1, valor_unitario: 335.00, valor_total: 335.00 },
    ],
  },
  {
    id: 'OS-2026-002',
    oficina_id: INITIAL_OFICINAS[0].id,
    cliente: MOCK_CLIENTS[1],
    veiculo: {
      id: 'v-2',
      oficina_id: INITIAL_OFICINAS[0].id,
      placa: 'FLX-9A88',
      modelo: 'Chevrolet Onix Turbo LTZ',
      marca: 'Chevrolet',
      ano: '2022',
      km_atual: 38900,
      cor: 'Preto Ouro Negro',
    },
    status: 'aguardando_aprovacao',
    defeito_relatado: 'Revisão periódica de 40.000 km e barulho ao passar em lombadas.',
    diagnostico_tecnico: 'Troca preventiva de óleo e filtros.',
    valor_total: 820.50,
    garantia_dias: 90,
    data_garantia_limite: calculateWarrantyDate('2026-07-24', 90),
    data_abertura: '2026-07-24T14:15:00.000Z',
    vistorias: [],
    itens: [
      { id: 'it-4', tipo: 'peca', descricao: 'Óleo Sintético 5W30 1L (Havoline)', quantidade: 4, valor_unitario: 58.00, valor_total: 232.00 },
      { id: 'it-5', tipo: 'peca', descricao: 'Filtro de Óleo (Mann Filter)', quantidade: 1, valor_unitario: 38.50, valor_total: 38.50 },
      { id: 'it-6', tipo: 'servico', descricao: 'Revisão Geral e Alinhamento 3D', quantidade: 1, valor_unitario: 550.00, valor_total: 550.00 },
    ],
  },
];

export const osService = {
  getOficinas(): Oficina[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_OFICINAS_LIST);
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_OFICINAS_LIST, JSON.stringify(INITIAL_OFICINAS));
        return INITIAL_OFICINAS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_OFICINAS;
    }
  },

  getActiveOficina(): Oficina {
    const list = this.getOficinas();
    const activeId = localStorage.getItem(LOCAL_STORAGE_OFICINA_ACTIVE);
    const found = list.find((o) => o.id === activeId);
    return found || list[0];
  },

  setActiveOficina(oficinaId: string): void {
    localStorage.setItem(LOCAL_STORAGE_OFICINA_ACTIVE, oficinaId);
  },

  getActiveUser(): UsuarioOficina | null {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USER_ACTIVE);
      if (stored) return JSON.parse(stored);
      return INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  },

  getUsers(): (UsuarioOficina & { senhaHash?: string })[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USERS_LIST);
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_USERS_LIST, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_USERS;
    }
  },

  async registerNewOficina(data: {
    nome: string;
    whatsapp: string;
    nomeResponsavel: string;
    email: string;
    senha: string;
    cidade?: string;
  }): Promise<{ oficina: Oficina; user: UsuarioOficina }> {
    const oficinas = this.getOficinas();
    const users = this.getUsers();

    const oficinaId = `of-${Date.now()}`;
    const slug = data.nome.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const newOficina: Oficina = {
      id: oficinaId,
      nome: data.nome,
      slug,
      whatsapp: data.whatsapp,
      endereco: data.cidade || 'Brasil',
    };

    const newUser: UsuarioOficina & { senhaHash?: string } = {
      id: `u-${Date.now()}`,
      oficina_id: oficinaId,
      nome: data.nomeResponsavel,
      email: data.email.toLowerCase().trim(),
      funcao: 'admin',
      senhaHash: data.senha,
    };

    oficinas.unshift(newOficina);
    users.unshift(newUser);

    localStorage.setItem(LOCAL_STORAGE_OFICINAS_LIST, JSON.stringify(oficinas));
    localStorage.setItem(LOCAL_STORAGE_USERS_LIST, JSON.stringify(users));
    localStorage.setItem(LOCAL_STORAGE_OFICINA_ACTIVE, oficinaId);
    localStorage.setItem(LOCAL_STORAGE_USER_ACTIVE, JSON.stringify(newUser));

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: supaUser } = await supabase.auth.signUp({
          email: data.email,
          password: data.senha,
        });

        await supabase.from('oficinas').upsert({
          id: oficinaId,
          nome: newOficina.nome,
          slug: newOficina.slug,
          whatsapp: newOficina.whatsapp,
          endereco: newOficina.endereco,
        });

        if (supaUser?.user) {
          await supabase.from('usuarios_oficina').upsert({
            id: supaUser.user.id,
            oficina_id: oficinaId,
            nome: data.nomeResponsavel,
            funcao: 'admin',
          });
        }
      } catch (err) {
        console.warn('Supabase Auth warning:', err);
      }
    }

    return { oficina: newOficina, user: newUser };
  },

  async loginUser(data: { email: string; senha: string }): Promise<{ success: boolean; message?: string }> {
    const cleanEmail = data.email.toLowerCase().trim();
    const users = this.getUsers();

    // 1. Check local storage users first
    const foundUser = users.find((u) => u.email.toLowerCase().trim() === cleanEmail && u.senhaHash === data.senha);

    if (foundUser) {
      this.setActiveOficina(foundUser.oficina_id);
      localStorage.setItem(LOCAL_STORAGE_USER_ACTIVE, JSON.stringify(foundUser));
      return { success: true };
    }

    // 2. Try Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: supaAuth, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: data.senha,
        });

        if (!error && supaAuth?.user) {
          const { data: supaPerfil } = await supabase
            .from('usuarios_oficina')
            .select('*, oficinas(*)')
            .eq('id', supaAuth.user.id)
            .single();

          if (supaPerfil) {
            const userObj: UsuarioOficina = {
              id: supaPerfil.id,
              oficina_id: supaPerfil.oficina_id,
              nome: supaPerfil.nome,
              email: cleanEmail,
              funcao: supaPerfil.funcao || 'admin',
            };

            this.setActiveOficina(supaPerfil.oficina_id);
            localStorage.setItem(LOCAL_STORAGE_USER_ACTIVE, JSON.stringify(userObj));
            return { success: true };
          }
        }
      } catch (err) {
        console.warn('Supabase login warning:', err);
      }
    }

    return { success: false, message: 'E-mail ou senha incorretos. Verifique suas credenciais.' };
  },

  logoutUser(): void {
    localStorage.removeItem(LOCAL_STORAGE_USER_ACTIVE);
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(console.warn);
    }
  },

  getOSList(): OrdemServico[] {
    const activeOficina = this.getActiveOficina();
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      let list: OrdemServico[] = stored ? JSON.parse(stored) : INITIAL_MOCK_OS;
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_OS));
      }
      return list.filter((os) => !os.oficina_id || os.oficina_id === activeOficina.id);
    } catch {
      return INITIAL_MOCK_OS.filter((os) => os.oficina_id === activeOficina.id);
    }
  },

  getOSById(id: string): OrdemServico | null {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: OrdemServico[] = stored ? JSON.parse(stored) : INITIAL_MOCK_OS;
    return list.find((os) => os.id === id) || null;
  },

  saveOS(osToSave: Partial<OrdemServico>): OrdemServico {
    const activeOficina = this.getActiveOficina();
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: OrdemServico[] = stored ? JSON.parse(stored) : INITIAL_MOCK_OS;
    
    let updatedOS: OrdemServico;

    if (osToSave.id) {
      const index = list.findIndex((item) => item.id === osToSave.id);
      if (index !== -1) {
        updatedOS = { ...list[index], ...osToSave } as OrdemServico;
        list[index] = updatedOS;
      } else {
        updatedOS = osToSave as OrdemServico;
        list.unshift(updatedOS);
      }
    } else {
      const nextNum = list.length + 1;
      const id = `OS-2026-${String(nextNum).padStart(3, '0')}`;
      const now = new Date().toISOString();
      const garantia = osToSave.garantia_dias || 90;

      updatedOS = {
        id,
        oficina_id: activeOficina.id,
        cliente: osToSave.cliente || MOCK_CLIENTS[0],
        veiculo: osToSave.veiculo || {
          id: `v-${Date.now()}`,
          oficina_id: activeOficina.id,
          placa: 'NOVA-000',
          modelo: 'Veículo Não Informado',
          km_atual: 0,
        },
        status: osToSave.status || 'em_diagnostico',
        defeito_relatado: osToSave.defeito_relatado || '',
        diagnostico_tecnico: osToSave.diagnostico_tecnico || '',
        valor_total: osToSave.valor_total || 0,
        garantia_dias: garantia,
        data_garantia_limite: calculateWarrantyDate(now, garantia),
        data_abertura: now,
        vistorias: osToSave.vistorias || [],
        itens: osToSave.itens || [],
        observacoes: osToSave.observacoes || '',
      };

      list.unshift(updatedOS);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));

    if (isSupabaseConfigured && supabase) {
      this.syncOSToSupabase(updatedOS).catch(console.error);
    }

    return updatedOS;
  },

  async syncOSToSupabase(os: OrdemServico): Promise<void> {
    if (!supabase) return;
    try {
      const { data: clientData } = await supabase.from('clientes').upsert({
        id: os.cliente.id.startsWith('cli-') ? undefined : os.cliente.id,
        oficina_id: os.oficina_id,
        nome: os.cliente.nome,
        whatsapp: os.cliente.whatsapp,
        cpf_cnpj: os.cliente.cpf_cnpj,
      }).select().single();

      const { data: vehicleData } = await supabase.from('veiculos').upsert({
        id: os.veiculo.id.startsWith('v-') ? undefined : os.veiculo.id,
        oficina_id: os.oficina_id,
        cliente_id: clientData?.id || os.cliente.id,
        placa: os.veiculo.placa,
        modelo: os.veiculo.modelo,
        km_atual: os.veiculo.km_atual,
      }).select().single();

      const { data: osData } = await supabase.from('ordens_servico').upsert({
        numero_os: os.id,
        oficina_id: os.oficina_id,
        cliente_id: clientData?.id || os.cliente.id,
        veiculo_id: vehicleData?.id || os.veiculo.id,
        status: os.status,
        defeito_relatado: os.defeito_relatado,
        diagnostico_tecnico: os.diagnostico_tecnico,
        valor_total: os.valor_total,
        garantia_dias: os.garantia_dias,
        data_garantia_limite: os.data_garantia_limite,
        data_abertura: os.data_abertura,
      }).select().single();

      if (osData && os.itens.length > 0) {
        const itemRows = os.itens.map((it) => ({
          ordem_servico_id: osData.id,
          tipo: it.tipo,
          descricao: it.descricao,
          quantidade: it.quantidade,
          valor_unitario: it.valor_unitario,
          valor_total: it.valor_total,
        }));
        await supabase.from('itens_os').upsert(itemRows);
      }
    } catch (err) {
      console.warn('Supabase Sync Warning:', err);
    }
  },

  updateStatus(id: string, newStatus: OrdemServico['status']): OrdemServico | null {
    const os = this.getOSById(id);
    if (!os) return null;

    os.status = newStatus;
    return this.saveOS(os);
  },

  deleteOS(id: string): void {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: OrdemServico[] = stored ? JSON.parse(stored) : INITIAL_MOCK_OS;
    const filtered = list.filter((os) => os.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  },

  getStats(): DashboardStats {
    const list = this.getOSList();
    const abertas = list.filter((os) => os.status !== 'concluido' && os.status !== 'cancelado').length;
    const aguardandoAprov = list.filter((os) => os.status === 'aguardando_aprovacao').length;
    const faturamento = list
      .filter((os) => os.status === 'concluido')
      .reduce((acc, os) => acc + os.valor_total, 0);

    return {
      osAbertas: abertas,
      aguardandoAprovacao: aguardandoAprov,
      faturamentoMes: faturamento,
      veiculosNoPatio: abertas,
    };
  },

  searchByPlaca(placaQuery: string): OrdemServico[] {
    const cleanQuery = placaQuery.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!cleanQuery) return this.getOSList();
    return this.getOSList().filter((os) =>
      os.veiculo.placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().includes(cleanQuery) ||
      os.veiculo.modelo.toUpperCase().includes(cleanQuery) ||
      os.cliente.nome.toUpperCase().includes(cleanQuery) ||
      os.id.toUpperCase().includes(cleanQuery)
    );
  },

  // Clients
  getClients(): Cliente[] {
    const activeOficina = this.getActiveOficina();
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CLIENTS);
      const list: Cliente[] = stored ? JSON.parse(stored) : MOCK_CLIENTS;
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_CLIENTS, JSON.stringify(MOCK_CLIENTS));
      }
      return list.filter((c) => !c.oficina_id || c.oficina_id === activeOficina.id);
    } catch {
      return MOCK_CLIENTS.filter((c) => c.oficina_id === activeOficina.id);
    }
  },

  saveClient(client: Partial<Cliente>): Cliente {
    const activeOficina = this.getActiveOficina();
    const stored = localStorage.getItem(LOCAL_STORAGE_CLIENTS);
    const clients: Cliente[] = stored ? JSON.parse(stored) : MOCK_CLIENTS;

    const newClient: Cliente = {
      id: client.id || `cli-${Date.now()}`,
      oficina_id: activeOficina.id,
      nome: client.nome || '',
      whatsapp: client.whatsapp || '',
      telefone: client.telefone || client.whatsapp || '',
      cpf_cnpj: client.cpf_cnpj || '',
      criado_em: new Date().toISOString(),
    };
    clients.unshift(newClient);
    localStorage.setItem(LOCAL_STORAGE_CLIENTS, JSON.stringify(clients));

    if (isSupabaseConfigured && supabase) {
      supabase.from('clientes').upsert({
        nome: newClient.nome,
        whatsapp: newClient.whatsapp,
        cpf_cnpj: newClient.cpf_cnpj,
        oficina_id: newClient.oficina_id,
      }).then();
    }

    return newClient;
  },

  // Parts / Inventory
  getParts(): Peca[] {
    const activeOficina = this.getActiveOficina();
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PARTS);
      const list: Peca[] = stored ? JSON.parse(stored) : MOCK_PECAS;
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_PARTS, JSON.stringify(MOCK_PECAS));
      }
      return list.filter((p) => !p.oficina_id || p.oficina_id === activeOficina.id);
    } catch {
      return MOCK_PECAS.filter((p) => p.oficina_id === activeOficina.id);
    }
  },

  savePart(part: Partial<Peca>): Peca {
    const activeOficina = this.getActiveOficina();
    const stored = localStorage.getItem(LOCAL_STORAGE_PARTS);
    const parts: Peca[] = stored ? JSON.parse(stored) : MOCK_PECAS;

    const newPart: Peca = {
      id: part.id || `p-${Date.now()}`,
      oficina_id: activeOficina.id,
      nome: part.nome || '',
      codigo_sku: part.codigo_sku || '',
      preco_unitario: part.preco_unitario || 0,
      quantidade_estoque: part.quantidade_estoque || 0,
    };
    parts.unshift(newPart);
    localStorage.setItem(LOCAL_STORAGE_PARTS, JSON.stringify(parts));

    if (isSupabaseConfigured && supabase) {
      supabase.from('pecas').upsert({
        nome: newPart.nome,
        codigo_sku: newPart.codigo_sku,
        preco_unitario: newPart.preco_unitario,
        quantidade_estoque: newPart.quantidade_estoque,
        oficina_id: newPart.oficina_id,
      }).then();
    }

    return newPart;
  }
};
