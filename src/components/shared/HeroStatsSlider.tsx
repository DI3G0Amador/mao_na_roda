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
      subtitle: `${stats.veiculosNoPatio} veículos em atendimento`,
      icon: <Wrench className="w-5 h-5 text-amber-400" />,
      badge: 'Ativas',
      gradient: 'from-amber-950/40 via-surface-card to-surface-card border-amber-500/30',
    },
    {
      title: 'Aguardando Aprovação',
      value: stats.aguardandoAprovacao,
      subtitle: 'Orçamentos enviados',
      icon: <Clock className="w-5 h-5 text-yellow-400" />,
      badge: 'Pendente',
      gradient: 'from-yellow-950/30 via-surface-card to-surface-card border-yellow-500/30',
    },
    {
      title: 'Faturamento Concluído',
      value: formatBRL(stats.faturamentoMes),
      subtitle: 'Total em serviços concluídos',
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      badge: 'Mês',
      gradient: 'from-emerald-950/30 via-surface-card to-surface-card border-emerald-500/30',
    },
  ];

  return (
    <div className="w-full py-2">
      <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible pb-3 md:pb-0 snap-x snap-mandatory scrollbar-none px-1">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`min-w-[82vw] sm:min-w-[280px] md:min-w-0 snap-center rounded-2xl p-4 md:p-5 border bg-gradient-to-br ${card.gradient} shadow-lg flex flex-col justify-between hover:border-primary/50 transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-surface/80 border border-border">
                {card.icon}
              </div>
              <span className="text-[10px] font-display uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-surface border border-border text-text-muted">
                {card.badge}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {card.title}
              </span>
              <div className="text-2xl md:text-3xl font-bold font-display text-text-main mt-0.5 tracking-tight">
                {card.value}
              </div>
              <p className="text-xs text-text-muted/80 mt-1 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-steel" />
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
