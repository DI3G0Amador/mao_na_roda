import React from 'react';
import { formatBRL, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';

interface StickyBottomBarProps {
  total: number;
  itemCount: number;
  garantiaDias?: number;
  garantiaData?: string;
  actionText?: string;
  onAction?: () => void;
  onShareWhatsApp?: () => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  total,
  itemCount,
  garantiaDias = 90,
  garantiaData,
  actionText = 'Avançar',
  onAction,
  onShareWhatsApp,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-card/95 backdrop-blur-md border-t border-border px-4 md:px-8 py-3.5 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Guarantee & Item Count pill */}
        <div className="flex items-center justify-between sm:justify-start gap-4 text-xs font-mono text-text-muted">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Garantia de {garantiaDias} Dias</span>
            {garantiaData && <span className="hidden sm:inline">(Até {formatDate(garantiaData)})</span>}
          </div>
          <span className="bg-surface px-2.5 py-1 rounded-md border border-border">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Real-time total */}
          <div className="text-left sm:text-right pr-2">
            <span className="text-[10px] font-display uppercase tracking-widest text-text-muted block">
              Total Calculado
            </span>
            <span className="text-xl md:text-2xl font-bold font-display text-primary leading-tight">
              {formatBRL(total)}
            </span>
          </div>

          {/* WhatsApp Share option if available */}
          {onShareWhatsApp && (
            <Button
              type="button"
              variant="success"
              size="md"
              onClick={onShareWhatsApp}
              hapticType="success"
              className="flex-none gap-2"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Enviar WhatsApp</span>
            </Button>
          )}

          {/* Primary Step / Save Action */}
          {onAction && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onAction}
              hapticType="medium"
              className="gap-2 px-6"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
