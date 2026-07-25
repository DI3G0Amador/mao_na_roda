import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { osService } from '@/services/osService';
import { Cliente, ItemOS, VistoriaFoto, StatusOS } from '@/types';
import { formatBRL, formatPlaca, calculateWarrantyDate } from '@/lib/utils';
import { Header } from '@/components/shared/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { InspectionPhotoGrid } from '@/components/os/InspectionPhotoGrid';
import { StickyBottomBar } from '@/components/os/StickyBottomBar';
import { QuickClientSheet } from '@/components/os/QuickClientSheet';
import { AddItemSheet } from '@/components/os/AddItemSheet';
import { WhatsAppShareModal } from '@/components/os/WhatsAppShareModal';
import {
  User,
  Car,
  Camera,
  Wrench,
  ShieldCheck,
  Plus,
  Trash2,
  ArrowLeft,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

export const OSWizard: React.FC = () => {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();

  // Wizard Step State (1: Cliente/Veículo, 2: Fotos, 3: Peças/Serviços, 4: Finalização)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [clientQuery, setClientQuery] = useState('');
  const [showQuickClient, setShowQuickClient] = useState(false);

  // Vehicle
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [kmAtual, setKmAtual] = useState('');
  const [defeitoRelatado, setDefeitoRelatado] = useState('');

  // Vistorias
  const [vistorias, setVistorias] = useState<VistoriaFoto[]>([]);

  // Items
  const [itens, setItens] = useState<ItemOS[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);

  // Warranty & Final
  const [garantiaDias] = useState(90);
  const [observacoes] = useState('');
  const [statusOS, setStatusOS] = useState<StatusOS>('em_diagnostico');

  // WhatsApp Share Modal
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [savedOSId, setSavedOSId] = useState<string | null>(null);

  // Available clients list for autocomplete
  const clients = osService.getClients();
  const filteredClients = clients.filter(
    (c) =>
      c.nome.toLowerCase().includes(clientQuery.toLowerCase()) ||
      c.whatsapp.includes(clientQuery)
  );

  const totalCalculado = itens.reduce((acc, it) => acc + it.valor_total, 0);

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedClient) {
        triggerHaptic('warning');
        alert('Selecione ou cadastre um cliente');
        return;
      }
      if (!placa.trim() || !modelo.trim()) {
        triggerHaptic('warning');
        alert('Preencha a Placa e o Modelo do Veículo');
        return;
      }
    }

    triggerHaptic('medium');
    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
    } else {
      handleFinalizeOS();
    }
  };

  const handlePrevStep = () => {
    triggerHaptic('light');
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    } else {
      navigate('/patio');
    }
  };

  const handleFinalizeOS = () => {
    triggerHaptic('success');
    const km = parseInt(kmAtual) || 0;
    const now = new Date().toISOString();

    const createdOS = osService.saveOS({
      cliente: selectedClient!,
      veiculo: {
        id: `v-${Date.now()}`,
        placa: formatPlaca(placa),
        modelo: modelo.trim(),
        km_atual: km,
      },
      status: statusOS,
      defeito_relatado: defeitoRelatado.trim() || 'Sem observações adicionais',
      valor_total: totalCalculado,
      garantia_dias: garantiaDias,
      data_garantia_limite: calculateWarrantyDate(now, garantiaDias),
      vistorias,
      itens,
      observacoes: observacoes.trim(),
    });

    setSavedOSId(createdOS.id);
    setShowWhatsAppModal(true);
  };

  return (
    <div className="min-h-screen bg-background text-text-main pb-32">
      <Header />

      {/* Top Stepper Header */}
      <div className="bg-surface px-4 md:px-8 py-3 border-b border-border sticky top-[57px] z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            className="p-2 text-text-muted hover:text-text-main rounded-xl hover:bg-surface-card flex items-center gap-1 min-h-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-display uppercase font-bold">Voltar</span>
          </button>

          {/* Stepper Dots & Labels */}
          <div className="flex items-center gap-2 font-display text-xs font-bold">
            <span className="text-primary uppercase tracking-wider">
              Passo {step} de 4
            </span>
            <div className="flex gap-1.5 ml-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    step >= i ? 'bg-primary scale-110' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* STEP 1: CLIENTE E VEÍCULO */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-border pb-3">
              <h2 className="text-xl font-bold font-display uppercase tracking-wide flex items-center gap-2 text-primary">
                <User className="w-6 h-6" /> 1. Cliente & Veículo
              </h2>
              <p className="text-sm text-text-muted">
                Identificação do proprietário e dados do veículo
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Selected Client Card or Search */}
              <div className="space-y-4 bg-surface-card p-5 rounded-2xl border border-border">
                <h3 className="text-sm font-bold font-display uppercase tracking-wide text-text-main flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" /> Proprietário / Cliente
                </h3>

                {selectedClient ? (
                  <div className="bg-surface border-2 border-primary/60 p-4 rounded-2xl flex items-center justify-between shadow-md">
                    <div>
                      <span className="text-[10px] uppercase font-display font-bold text-primary tracking-widest block">
                        Cliente Selecionado
                      </span>
                      <h4 className="text-base font-bold text-text-main">{selectedClient.nome}</h4>
                      <p className="text-xs text-text-muted font-mono">
                        WhatsApp: {selectedClient.whatsapp}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClient(null)}
                      className="text-xs text-amber-400 hover:text-amber-300"
                    >
                      Alterar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Buscar cliente por nome ou zap..."
                          value={clientQuery}
                          onChange={(e) => setClientQuery(e.target.value)}
                          leftIcon={<Search className="w-4 h-4" />}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowQuickClient(true)}
                        className="whitespace-nowrap"
                      >
                        + Cliente Rápido
                      </Button>
                    </div>

                    {clientQuery && (
                      <div className="bg-surface border border-border rounded-xl p-2 max-h-48 overflow-y-auto space-y-1">
                        {filteredClients.map((client) => (
                          <div
                            key={client.id}
                            onClick={() => {
                              setSelectedClient(client);
                              setClientQuery('');
                            }}
                            className="p-2.5 hover:bg-surface-card rounded-lg cursor-pointer flex justify-between items-center"
                          >
                            <div>
                              <p className="text-sm font-semibold text-text-main">{client.nome}</p>
                              <p className="text-xs text-text-muted">{client.whatsapp}</p>
                            </div>
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vehicle Inputs */}
              <div className="space-y-4 bg-surface-card p-5 rounded-2xl border border-border">
                <h3 className="text-sm font-bold font-display uppercase tracking-wide text-text-main flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-primary" /> Dados do Veículo
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Placa do Veículo *"
                    placeholder="Ex: ABC1D23"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    className="font-mono uppercase font-bold text-center tracking-widest text-lg bg-zinc-950 border-zinc-700"
                  />
                  <Input
                    label="KM Atual *"
                    placeholder="Ex: 54000"
                    type="number"
                    inputMode="numeric"
                    value={kmAtual}
                    onChange={(e) => setKmAtual(e.target.value)}
                  />
                </div>

                <Input
                  label="Modelo do Veículo *"
                  placeholder="Ex: VW Gol 1.6 MSI Flex 2021"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Defeito Relatado / Sintoma do Cliente
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descreva o barulho, sintoma ou pedido do cliente..."
                    value={defeitoRelatado}
                    onChange={(e) => setDefeitoRelatado(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FOTOS DO VEÍCULO */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-border pb-3">
              <h2 className="text-xl font-bold font-display uppercase tracking-wide flex items-center gap-2 text-primary">
                <Camera className="w-6 h-6" /> 2. Fotos do Veículo
              </h2>
              <p className="text-sm text-text-muted">
                Registre fotos do painel (KM), estado geral ou detalhes na entrada
              </p>
            </div>

            <div className="bg-surface-card p-6 rounded-2xl border border-border">
              <InspectionPhotoGrid
                photos={vistorias}
                onAddPhoto={(photo) => setVistorias((prev) => [...prev, photo])}
                onRemovePhoto={(id) => setVistorias((prev) => prev.filter((p) => p.id !== id))}
              />
            </div>
          </div>
        )}

        {/* STEP 3: PEÇAS E SERVIÇOS */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display uppercase tracking-wide flex items-center gap-2 text-primary">
                  <Wrench className="w-6 h-6" /> 3. Peças & Serviços
                </h2>
                <p className="text-sm text-text-muted">
                  Adicione itens do estoque ou mão de obra customizada
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowAddItem(true)}
                className="gap-1.5 shadow-md"
              >
                <Plus className="w-5 h-5" /> Adicionar Item
              </Button>
            </div>

            <div className="bg-surface-card p-6 rounded-2xl border border-border">
              {itens.length > 0 ? (
                <div className="space-y-3">
                  {itens.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-surface border border-border rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono uppercase px-2 py-0.5 rounded ${
                              item.tipo === 'peca'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {item.tipo}
                          </span>
                          <h4 className="text-base font-semibold text-text-main">
                            {item.descricao}
                          </h4>
                        </div>
                        <p className="text-xs text-text-muted mt-1">
                          {item.quantidade}x {formatBRL(item.valor_unitario)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-base md:text-lg font-bold font-display text-primary">
                          {formatBRL(item.valor_total)}
                        </span>
                        <button
                          onClick={() =>
                            setItens((prev) => prev.filter((i) => i.id !== item.id))
                          }
                          className="p-2 text-text-muted hover:text-red-400 hover:bg-surface-card rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-surface/50 border border-dashed border-border rounded-2xl space-y-3">
                  <Wrench className="w-12 h-12 text-text-muted/40 mx-auto" />
                  <p className="text-sm text-text-muted">
                    Nenhum item ou mão de obra adicionado ainda.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setShowAddItem(true)}>
                    + Adicionar Primeiro Item
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: FINALIZAÇÃO E GARANTIA */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-border pb-3">
              <h2 className="text-xl font-bold font-display uppercase tracking-wide flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-6 h-6" /> 4. Finalização & Garantia de 90 Dias
              </h2>
              <p className="text-sm text-text-muted">
                Revisão final antes de emitir o comprovante e enviar ao cliente
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Guarantee Box */}
              <div className="bg-emerald-950/25 border-2 border-emerald-500/40 p-6 rounded-2xl space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-display uppercase text-lg">
                  <ShieldCheck className="w-6 h-6" /> Garantia de 90 Dias Inclusa
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  Validade até{' '}
                  <strong className="text-text-main font-mono text-base">
                    {calculateWarrantyDate(new Date().toISOString(), garantiaDias)}
                  </strong>
                  .
                </p>
              </div>

              {/* Status Selection */}
              <div className="space-y-4 bg-surface-card p-6 rounded-2xl border border-border">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Status Inicial da OS
                  </label>
                  <select
                    value={statusOS}
                    onChange={(e) => setStatusOS(e.target.value as StatusOS)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-main font-display text-base focus:ring-primary"
                  >
                    <option value="em_diagnostico">Em Diagnóstico</option>
                    <option value="aguardando_aprovacao">Aguardando Aprovação do Cliente</option>
                    <option value="aguardando_peca">Aguardando Peça</option>
                    <option value="em_execucao">Em Execução</option>
                    <option value="concluido">Concluído / Pronto</option>
                  </select>
                </div>

                <div className="text-xs space-y-1 text-text-muted border-t border-border pt-3">
                  <p><strong className="text-text-main">Cliente:</strong> {selectedClient?.nome}</p>
                  <p><strong className="text-text-main">Veículo:</strong> {modelo} ({formatPlaca(placa)})</p>
                  <p><strong className="text-text-main">Fotos:</strong> {vistorias.length} foto(s)</p>
                  <p><strong className="text-text-main">Itens:</strong> {itens.length} item(ns)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Bar with Realtime Total */}
      <StickyBottomBar
        total={totalCalculado}
        itemCount={itens.length}
        garantiaDias={garantiaDias}
        actionText={step === 4 ? 'Emitir & Salvar OS' : 'Próximo Passo'}
        onAction={handleNextStep}
      />

      {/* Modals & Sheets */}
      <QuickClientSheet
        isOpen={showQuickClient}
        onClose={() => setShowQuickClient(false)}
        onClientCreated={(client) => setSelectedClient(client)}
      />

      <AddItemSheet
        isOpen={showAddItem}
        onClose={() => setShowAddItem(false)}
        onItemAdded={(item) => setItens((prev) => [...prev, item])}
      />

      {savedOSId && (
        <WhatsAppShareModal
          isOpen={showWhatsAppModal}
          onClose={() => {
            setShowWhatsAppModal(false);
            navigate('/patio');
          }}
          os={osService.getOSById(savedOSId)!}
        />
      )}
    </div>
  );
};
