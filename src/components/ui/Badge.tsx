import React from 'react';
import { StatusOS } from '@/types';
import { cn } from '@/lib/utils';
import { Wrench, Clock, AlertTriangle, CheckCircle2, XCircle, Package } from 'lucide-react';

interface BadgeProps {
  status: StatusOS;
  size?: 'sm' | 'md';
  className?: string;
}

export const statusConfig: Record<StatusOS, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  em_diagnostico: {
    label: 'Em Diagnóstico',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    icon: <Wrench className="w-3.5 h-3.5" />,
  },
  aguardando_peca: {
    label: 'Aguardando Peça',
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    icon: <Package className="w-3.5 h-3.5" />,
  },
  aguardando_aprovacao: {
    label: 'Aguardando Aprovação',
    bg: 'bg-yellow-500/15',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  em_execucao: {
    label: 'Em Execução',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  concluido: {
    label: 'Pronto / Concluído',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  cancelado: {
    label: 'Cancelado',
    bg: 'bg-zinc-500/15',
    text: 'text-zinc-400',
    border: 'border-zinc-500/30',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md', className }) => {
  const config = statusConfig[status] || statusConfig.em_diagnostico;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-display uppercase tracking-wider rounded-lg border font-semibold select-none',
        config.bg,
        config.text,
        config.border,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
