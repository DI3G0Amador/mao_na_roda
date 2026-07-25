import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrdemServico } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatPlaca(placa: string): string {
  const clean = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (clean.length === 7) {
    // Mercosul (ABC1D23) or Antiga (ABC1234)
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  return clean;
}

export function calculateWarrantyDate(startDate: string, days: number = 90): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export function generateWhatsAppMessage(os: OrdemServico): string {
  const itensStr = os.itens
    .map((item) => `• ${item.quantidade}x ${item.descricao} - ${formatBRL(item.valor_total)}`)
    .join('\n');

  const texto = `🛠️ *MÃO NA RODA - RESUMO DE ORDEM DE SERVIÇO* 🛠️
-----------------------------------
📋 *OS:* #${os.id}
👤 *Cliente:* ${os.cliente.nome}
🚗 *Veículo:* ${os.veiculo.modelo} (${os.veiculo.placa})
📏 *KM:* ${os.veiculo.km_atual.toLocaleString('pt-BR')} km

🔧 *Serviços & Peças:*
${itensStr.length > 0 ? itensStr : '• Diagnóstico inicial'}

💰 *VALOR TOTAL:* ${formatBRL(os.valor_total)}
🛡️ *GARANTIA PADRÃO:* ${os.garantia_dias} Dias (Até ${formatDate(os.data_garantia_limite)})

Obrigado pela confiança! Qualquer dúvida, responda este WhatsApp.`;

  return encodeURIComponent(texto);
}
