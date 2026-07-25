import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OrdemServico } from '@/types';
import { formatBRL, formatPlaca, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { MessageCircle, ChevronRight, Camera, User, Calendar, Gauge } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

interface VehicleCardProps {
  os: OrdemServico;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ os }) => {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();

  const handleOpenDetails = () => {
    triggerHaptic('light');
    navigate(`/os/${os.id}`);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    const url = `https://wa.me/${os.cliente.whatsapp.replace(/\D/g, '')}`;
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={handleOpenDetails}
      className="bg-surface-card border border-border/70 hover:border-primary/50 rounded-2xl p-4 transition-all duration-200 shadow-md active:scale-[0.99] cursor-pointer group"
    >
      {/* Top Bar: Placa & Status Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          {/* Placa Tag */}
          <div className="bg-zinc-950 border border-zinc-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-mono font-bold tracking-widest text-text-main text-sm">
              {formatPlaca(os.veiculo.placa)}
            </span>
          </div>
          <span className="text-xs font-mono text-text-muted">#{os.id}</span>
        </div>

        <Badge status={os.status} size="sm" />
      </div>

      {/* Main Info */}
      <div className="py-3 space-y-1.5">
        <h3 className="text-base font-bold font-display text-text-main group-hover:text-primary transition-colors flex items-center justify-between">
          {os.veiculo.modelo}
          <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-transform group-hover:translate-x-1" />
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-steel" />
            <span className="truncate">{os.cliente.nome}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Gauge className="w-3.5 h-3.5 text-steel" />
            <span>{os.veiculo.km_atual.toLocaleString('pt-BR')} km</span>
          </div>
        </div>

        <p className="text-xs text-text-muted/80 line-clamp-2 pt-1 font-sans italic bg-surface/50 p-2 rounded-lg border border-border/40">
          "{os.defeito_relatado}"
        </p>
      </div>

      {/* Footer Info: Total & Actions */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted block">
              Valor OS
            </span>
            <span className="text-base font-bold font-display text-primary">
              {formatBRL(os.valor_total)}
            </span>
          </div>

          {os.vistorias && os.vistorias.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-steel bg-surface px-2 py-1 rounded-md border border-border">
              <Camera className="w-3 h-3" />
              <span>{os.vistorias.length} fotos</span>
            </div>
          )}
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center min-h-[44px] min-w-[44px]"
          title="Falar no WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
