import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrdemServico } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(amount: number): string {
  const safeAmount = isNaN(amount) || amount < 0 ? 0 : amount;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(safeAmount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function sanitizePhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (!clean) return '';
  return clean.startsWith('55') ? clean : `55${clean}`;
}

export function formatPlaca(placa: string): string {
  const clean = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (clean.length === 7) {
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  return clean;
}

export function calculateWarrantyDate(startDate: string, days: number = 90): string {
  const date = new Date(startDate);
  if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export function generateWhatsAppMessage(os: OrdemServico): string {
  const sanitize = (text?: string) => (text || '').replace(/[\r\n]+/g, ' ').trim();

  const itensStr = os.itens
    .map((item) => `• ${item.quantidade}x ${sanitize(item.descricao)} - ${formatBRL(item.valor_total)}`)
    .join('\n');

  const texto = `🛠️ *MÃO NA RODA - RESUMO DE SERVIÇO* 🛠️
-----------------------------------
📋 *OS:* #${sanitize(os.id)}
👤 *Cliente:* ${sanitize(os.cliente.nome)}
🚗 *Veículo:* ${sanitize(os.veiculo.modelo)} (${formatPlaca(os.veiculo.placa)})
📏 *KM:* ${os.veiculo.km_atual.toLocaleString('pt-BR')} km

🔧 *Serviços & Peças:*
${itensStr.length > 0 ? itensStr : '• Diagnóstico inicial'}

💰 *VALOR TOTAL:* ${formatBRL(os.valor_total)}
🛡️ *GARANTIA:* ${os.garantia_dias} Dias (Até ${formatDate(os.data_garantia_limite)})

Obrigado pela confiança! Responda esta mensagem se tiver qualquer dúvida.`;

  return encodeURIComponent(texto);
}
