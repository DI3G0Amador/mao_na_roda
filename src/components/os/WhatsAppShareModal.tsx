import React from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { OrdemServico } from '@/types';
import { formatDate, generateWhatsAppMessage } from '@/lib/utils';
import { MessageCircle, Copy, ShieldCheck, Check } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';
import logoFull from '@/assets/logo-full.png';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  os: OrdemServico;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  os,
}) => {
  const [copied, setCopied] = React.useState(false);
  const { triggerHaptic } = useHaptic();

  const rawText = decodeURIComponent(generateWhatsAppMessage(os));

  const handleSendWhatsApp = () => {
    triggerHaptic('success');
    const waUrl = `https://wa.me/${os.cliente.whatsapp.replace(/\D/g, '')}?text=${generateWhatsAppMessage(os)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyText = () => {
    triggerHaptic('light');
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="💬 Enviar Comprovante no WhatsApp"
      subtitle={`OS #${os.id} • Cliente: ${os.cliente.nome}`}
    >
      <div className="space-y-4 pt-1">
        {/* Logo Banner */}
        <div className="flex justify-center pb-1">
          <img src={logoFull} alt="Mão na Roda Logo" className="h-24 object-contain rounded-xl shadow-lg border border-border/40 p-2 bg-surface" />
        </div>

        {/* Preview Container */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" /> Prévia da Mensagem
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
              WhatsApp Ready
            </span>
          </div>

          <pre className="text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto p-2 bg-black/40 rounded-xl">
            {rawText}
          </pre>
        </div>

        {/* Guarantee Banner */}
        <div className="p-3 bg-surface border border-border rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-text-main">Garantia Padrão Ativa</p>
              <p className="text-[11px] text-text-muted">Validade: {os.garantia_dias} Dias (Até {formatDate(os.data_garantia_limite)})</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button
            type="button"
            variant="success"
            fullWidth
            size="lg"
            onClick={handleSendWhatsApp}
            hapticType="success"
            className="gap-2 text-base shadow-xl"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
            Abrir WhatsApp e Enviar
          </Button>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            size="md"
            onClick={handleCopyText}
          >
            {copied ? (
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <Check className="w-4 h-4" /> Texto Copiado!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Copy className="w-4 h-4" /> Copiar Texto Completo
              </span>
            )}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};
