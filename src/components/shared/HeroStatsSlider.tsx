import React from 'react';
import { DashboardStats } from '@/types';
import { formatBRL } from '@/lib/utils';
import { Wrench, Clock, DollarSign, Car } from 'lucide-react';

interface HeroStatsSliderProps {
  stats: DashboardStats;
}

export const HeroStatsSlider: React.FC<HeroStatsSliderProps> = ({ stats }) => {
  const cards = [
    {
      title: 'OS em Aberto',
      value: stats.osAbertas,
      subtitle: `${stats.veiculosNoPatio} em atendimento`,
      icon: <Wrench className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />,
      badge: 'Ativas',
      gradient: 'from-amber-950/40 via-surface-card to-surface-card border-amber-500/30',
    },
    {
      title: 'Aguardando Aprovação',
      value: stats.aguardandoAprovacao,
      subtitle: 'Orçamentos enviados',
      icon: <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />,
      badge: 'Pendente',
      gradient: 'from-yellow-950/30 via-surface-card to-surface-card border-yellow-500/30',
    },
    {
      title: 'Faturamento Concluído',
      value: formatBRL(stats.faturamentoMes),
      subtitle: 'Serviços concluídos',
      icon: <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />,
      badge: 'Mês',
      gradient: 'from-emerald-950/30 via-surface-card to-surface-card border-emerald-500/30',
    },
  ];

  return (
    <div className="w-full py-1">
      <div className="flex md:grid md:grid-cols-3 gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 snap-x snap-mandatory scrollbar-none px-1">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`min-w-[78vw] sm:min-w-[260px] md:min-w-0 snap-center rounded-2xl p-3 md:px-4 md:py-3 border bg-gradient-to-br ${card.gradient} shadow-md flex items-center justify-between gap-3 hover:border-primary/50 transition-all`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2.5 rounded-xl bg-surface/80 border border-border flex-none">
                {card.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted truncate">
                    {card.title}
                  </span>
                  <span className="text-[9px] font-display uppercase tracking-widest font-semibold px-1.5 py-0.2 rounded bg-surface border border-border text-text-muted flex-none">
                    {card.badge}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2 mt-0.5">
                  <div className="text-xl md:text-2xl font-bold font-display text-text-main tracking-tight leading-none">
                    {card.value}
                  </div>
                  <span className="text-[10px] text-text-muted/70 truncate hidden sm:inline">
                    {card.subtitle}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
