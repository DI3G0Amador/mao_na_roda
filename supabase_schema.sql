-- ====================================================================
-- SPEC DDL: SCRIPT SQL DE BANCO DE DADOS MULTI-TENANT (MULTI-OFICINA)
-- APLICAÇÃO: MÃO NA RODA (GESTÃO DE OFICINAS) - SUPABASE
-- ====================================================================

-- Habilitar extensão para geração de UUID v4
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. TABELA DE OFICINAS (TENANTS)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.oficinas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cnpj TEXT,
    telefone TEXT,
    whatsapp TEXT NOT NULL,
    endereco TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. TABELA DE USUÁRIOS/MECÂNICOS DA OFICINA (VINCULADO AO AUTH.USERS)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.usuarios_oficina (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    oficina_id UUID NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    funcao TEXT DEFAULT 'mecanico', -- 'admin', 'mecanico', 'recepcao'
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. TABELA DE CLIENTES (ISOLADOS POR OFICINA)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    oficina_id UUID NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    telefone TEXT,
    cpf_cnpj TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Index para buscas rápidas de clientes por oficina
CREATE INDEX IF NOT EXISTS idx_clientes_oficina ON public.clientes(oficina_id);

-- --------------------------------------------------------------------
-- 4. TABELA DE VEÍCULOS (ISOLADOS POR OFICINA)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.veiculos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    oficina_id UUID NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    placa TEXT NOT NULL,
    modelo TEXT NOT NULL,
    marca TEXT,
    ano TEXT,
    km_atual INTEGER DEFAULT 0,
    cor TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Index de busca por placa dentro da oficina (Consulta em <3 segundos)
CREATE INDEX IF NOT EXISTS idx_veiculos_placa ON public.veiculos(oficina_id, placa);

-- --------------------------------------------------------------------
-- 5. TABELA DE ESTOQUE / PEÇAS (ISOLADOS POR OFICINA)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pecas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    oficina_id UUID NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    codigo_sku TEXT,
    preco_unitario NUMERIC(10,2) DEFAULT 0.00,
    quantidade_estoque INTEGER DEFAULT 0,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pecas_oficina ON public.pecas(oficina_id);

-- --------------------------------------------------------------------
-- 6. TABELA DE ORDENS DE SERVIÇO (ISOLADAS POR OFICINA)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ordens_servico (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_os TEXT NOT NULL, -- Ex: OS-2026-001
    oficina_id UUID NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    veiculo_id UUID NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'em_diagnostico',
    defeito_relatado TEXT NOT NULL,
    diagnostico_tecnico TEXT,
    valor_total NUMERIC(10,2) DEFAULT 0.00,
    garantia_dias INTEGER DEFAULT 90,
    data_garantia_limite DATE,
    data_abertura TIMESTAMPTZ DEFAULT NOW(),
    data_previsao TIMESTAMPTZ,
    observacoes TEXT
);

CREATE INDEX IF NOT EXISTS idx_os_oficina_status ON public.ordens_servico(oficina_id, status);

-- --------------------------------------------------------------------
-- 7. TABELA DE ITENS DA OS (PEÇAS E MÃO DE OBRA)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.itens_os (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ordem_servico_id UUID NOT NULL REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL, -- 'peca' ou 'servico'
    descricao TEXT NOT NULL,
    quantidade NUMERIC(10,2) DEFAULT 1,
    valor_unitario NUMERIC(10,2) DEFAULT 0.00,
    valor_total NUMERIC(10,2) DEFAULT 0.00
);

-- --------------------------------------------------------------------
-- 8. TABELA DE FOTOS DE VISTORIA VISUAL
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vistorias_fotos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ordem_servico_id UUID NOT NULL REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    categoria TEXT DEFAULT 'avaria', -- 'avaria', 'painel_km', 'pneu', 'geral'
    descricao TEXT,
    data_criacao TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- SEGURANÇA MULTI-TENANT: ROW LEVEL SECURITY (RLS)
-- Garanter que uma oficina NUNCA acesse os dados de outra oficina!
-- ====================================================================

-- Função Auxiliar para obter a Oficina ID do usuário logado no Supabase
CREATE OR REPLACE FUNCTION public.get_user_oficina_id()
RETURNS UUID AS $$
  SELECT oficina_id FROM public.usuarios_oficina WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.oficinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_oficina ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pecas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_os ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vistorias_fotos ENABLE ROW LEVEL SECURITY;

-- Políticas de Isolamento RLS
CREATE POLICY "Clientes: Apenas da própria oficina" ON public.clientes
    FOR ALL USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Veículos: Apenas da própria oficina" ON public.veiculos
    FOR ALL USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Peças: Apenas da própria oficina" ON public.pecas
    FOR ALL USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Ordens de Serviço: Apenas da própria oficina" ON public.ordens_servico
    FOR ALL USING (oficina_id = public.get_user_oficina_id());

-- ====================================================================
-- DADOS INICIAIS DE DEMONSTRAÇÃO (OFICINA RÚSTICA DEMO)
-- ====================================================================

INSERT INTO public.oficinas (id, nome, slug, whatsapp, endereco)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Oficina Rústica Auto Center',
    'oficina-rustica',
    '5511988776655',
    'Av. dos Automóveis, 1500 - São Paulo, SP'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.oficinas (id, nome, slug, whatsapp, endereco)
VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    'Garagem Central Motores',
    'garagem-central',
    '5511977665544',
    'Rua das Oficinas, 420 - Campinas, SP'
) ON CONFLICT (slug) DO NOTHING;
