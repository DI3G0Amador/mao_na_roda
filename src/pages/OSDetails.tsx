import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { osService } from '@/services/osService';
import { OrdemServico, StatusOS } from '@/types';
import { formatBRL, formatPlaca, formatDate } from '@/lib/utils';
import { Header } from '@/components/shared/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WhatsAppShareModal } from '@/components/os/WhatsAppShareModal';
import {
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Wrench,
  User,
  Camera,
  Gauge,
  Phone,
  Trash2,
} from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

export const OSDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();

  const [os, setOs] = useState<OrdemServico | null>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  useEffect(() => {
    if (id) {
      const found = osService.getOSById(id);
      setOs(found);
    }
  }, [id]);

  if (!os) {
    return (
      <div className="min-h-screen bg-background text-text-main p-6 max-w-lg mx-auto text-center space-y-4">
        <Header />
        <div className="py-12 bg-surface-card rounded-2xl border border-border mt-6">
          <p className="text-text-muted text-sm">Ordem de Serviço não encontrada.</p>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/')}>
            Voltar ao Pátio
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: StatusOS) => {
    triggerHaptic('success');
    const updated = osService.updateStatus(os.id, newStatus);
    if (updated) setOs(updated);
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta Ordem de Serviço?')) {
      triggerHaptic('warning');
      osService.deleteOS(os.id);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 md:pb-12">
      <Header />

      {/* Top Action Bar */}
      <div className="bg-surface px-4 md:px-8 py-3 border-b border-border sticky top-[57px] z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              triggerHaptic('light');
              navigate('/');
            }}
            className="p-2 text-text-muted hover:text-text-main rounded-xl hover:bg-surface-card flex items-center gap-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-display uppercase font-bold">Voltar ao Pátio</span>
          </button>

          <span className="font-mono font-bold text-base text-primary">#{os.id}</span>

          <button
            onClick={handleDelete}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl"
            title="Excluir OS"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Placa, Cliente, Symptom, Photos) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Placa & Status Card */}
            <div className="bg-surface-card border border-border rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="bg-zinc-950 border border-zinc-700 px-3.5 py-1.5 rounded-lg">
                  <span className="font-mono font-bold tracking-widest text-text-main text-lg">
                    {formatPlaca(os.veiculo.placa)}
                  </span>
                </div>
                <Badge status={os.status} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <h2 className="text-xl font-bold font-display text-text-main">{os.veiculo.modelo}</h2>
                <span className="text-xs font-mono text-text-muted flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  {os.veiculo.km_atual.toLocaleString('pt-BR')} km
                </span>
              </div>

              {/* Quick Status Changer Dropdown */}
              <div className="pt-2">
                <label className="block text-[10px] uppercase font-display font-bold text-text-muted mb-1">
                  Alterar Fase do Serviço:
                </label>
                <select
                  value={os.status}
                  onChange={(e) => handleStatusChange(e.target.value as StatusOS)}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-xs font-display text-text-main focus:ring-primary"
                >
                  <option value="em_diagnostico">Em Diagnóstico</option>
                  <option value="aguardando_aprovacao">Aguardando Aprovação</option>
                  <option value="aguardando_peca">Aguardando Peça</option>
                  <option value="em_execucao">Em Execução</option>
                  <option value="concluido">Concluído / Pronto</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Cliente Card */}
            <div className="bg-surface-card border border-border rounded-2xl p-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-display uppercase font-bold text-text-muted block">
                  Proprietário
                </span>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> {os.cliente.nome}
                </h3>
                <p className="text-xs text-text-muted font-mono">{os.cliente.whatsapp}</p>
              </div>

              <a
                href={`https://wa.me/${os.cliente.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>

            {/* Defeito e Diagnóstico */}
            <div className="bg-surface-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold font-display uppercase tracking-wide text-primary">
                Sintoma Relatado pelo Cliente
              </h3>
              <p className="text-sm text-text-main bg-surface p-4 rounded-xl border border-border/50">
                "{os.defeito_relatado}"
              </p>

              {os.diagnostico_tecnico && (
                <>
                  <h3 className="text-xs font-bold font-display uppercase tracking-wide text-amber-400 pt-2">
                    Diagnóstico Técnico da Oficina
                  </h3>
                  <p className="text-sm text-text-main bg-surface p-4 rounded-xl border border-border/50">
                    {os.diagnostico_tecnico}
                  </p>
                </>
              )}
            </div>

            {/* Vistoria Photos */}
            {os.vistorias && os.vistorias.length > 0 && (
              <div className="space-y-3 bg-surface-card p-5 rounded-2xl border border-border">
                <h3 className="text-xs font-bold font-display uppercase tracking-wide text-text-muted flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-primary" /> Fotos da Vistoria ({os.vistorias.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {os.vistorias.map((v) => (
                    <div key={v.id} className="relative rounded-xl overflow-hidden border border-border">
                      <img src={v.url} alt={v.descricao} className="w-full h-32 object-cover" />
                      <span className="absolute bottom-1 left-1 right-1 text-[10px] bg-black/80 px-1.5 py-0.5 rounded text-white truncate font-mono">
                        {v.descricao}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Items Table, Total, Guarantee, Actions) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Items Table */}
            <div className="bg-surface-card border border-border rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-sm font-bold font-display uppercase tracking-wide text-text-main border-b border-border pb-3 flex items-center justify-between">
                <span>Serviços & Peças ({os.itens.length})</span>
                <Wrench className="w-4 h-4 text-primary" />
              </h3>

              <div className="space-y-3">
                {os.itens.map((it) => (
                  <div key={it.id} className="flex justify-between items-center text-xs md:text-sm py-1.5 border-b border-border/40 last:border-none">
                    <div>
                      <p className="font-semibold text-text-main">{it.descricao}</p>
                      <p className="text-text-muted text-xs">
                        {it.quantidade}x {formatBRL(it.valor_unitario)}
                      </p>
                    </div>
                    <span className="font-bold font-display text-primary">{formatBRL(it.valor_total)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-center text-base font-bold">
                <span className="font-display uppercase text-text-muted">Total da OS:</span>
                <span className="text-2xl font-display text-primary">{formatBRL(os.valor_total)}</span>
              </div>
            </div>

            {/* Guarantee Banner */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-400 flex-none" />
              <div>
                <h4 className="text-xs font-bold text-emerald-400 font-display uppercase">
                  Garantia Legal de {os.garantia_dias} Dias
                </h4>
                <p className="text-xs text-text-muted">
                  Validade até{' '}
                  <strong className="text-text-main">{formatDate(os.data_garantia_limite)}</strong>.
                </p>
              </div>
            </div>

            {/* Send WhatsApp Action */}
            <Button
              variant="success"
              fullWidth
              size="lg"
              onClick={() => {
                triggerHaptic('success');
                setShowWhatsApp(true);
              }}
              className="gap-2 shadow-xl text-base py-4"
            >
              <MessageCircle className="w-6 h-6 fill-current" />
              Enviar Resumo no WhatsApp
            </Button>
          </div>
        </div>
      </main>

      <WhatsAppShareModal
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        os={os}
      />
    </div>
  );
};
