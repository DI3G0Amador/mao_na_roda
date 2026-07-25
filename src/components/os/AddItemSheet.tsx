import React, { useState, useEffect } from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ItemOS, Peca } from '@/types';
import { osService } from '@/services/osService';
import { formatBRL } from '@/lib/utils';
import { Package, Wrench, Search, Plus, Check } from 'lucide-react';

interface AddItemSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: (item: ItemOS) => void;
}

export const AddItemSheet: React.FC<AddItemSheetProps> = ({
  isOpen,
  onClose,
  onItemAdded,
}) => {
  const [tab, setTab] = useState<'peca' | 'servico'>('peca');
  const [parts, setParts] = useState<Peca[]>([]);
  const [searchPart, setSearchPart] = useState('');
  
  // Custom Form fields
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [valorUnitario, setValorUnitario] = useState('');

  useEffect(() => {
    if (isOpen) {
      setParts(osService.getParts());
    }
  }, [isOpen]);

  const filteredParts = parts.filter((p) =>
    p.nome.toLowerCase().includes(searchPart.toLowerCase()) ||
    (p.codigo_sku && p.codigo_sku.toLowerCase().includes(searchPart.toLowerCase()))
  );

  const handleSelectPart = (part: Peca) => {
    const newItem: ItemOS = {
      id: `it-${Date.now()}`,
      tipo: 'peca',
      descricao: part.nome,
      quantidade: 1,
      valor_unitario: part.preco_unitario,
      valor_total: part.preco_unitario,
    };
    onItemAdded(newItem);
    resetForm();
    onClose();
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;
    const unitPrice = parseFloat(valorUnitario.replace(',', '.')) || 0;

    const newItem: ItemOS = {
      id: `it-${Date.now()}`,
      tipo: tab,
      descricao: descricao.trim(),
      quantidade: Math.max(1, quantidade),
      valor_unitario: unitPrice,
      valor_total: unitPrice * Math.max(1, quantidade),
    };

    onItemAdded(newItem);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setDescricao('');
    setQuantidade(1);
    setValorUnitario('');
    setSearchPart('');
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="+ Adicionar Item na OS"
      subtitle="Escolha peças do estoque ou digite serviços customizados"
    >
      {/* Tabs */}
      <div className="flex bg-surface p-1 rounded-xl border border-border mb-4">
        <button
          type="button"
          onClick={() => setTab('peca')}
          className={`flex-1 py-2.5 rounded-lg font-display uppercase tracking-wider text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            tab === 'peca' ? 'bg-primary text-black shadow-md' : 'text-text-muted hover:text-text-main'
          }`}
        >
          <Package className="w-4 h-4" />
          Peça de Estoque
        </button>
        <button
          type="button"
          onClick={() => setTab('servico')}
          className={`flex-1 py-2.5 rounded-lg font-display uppercase tracking-wider text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            tab === 'servico' ? 'bg-primary text-black shadow-md' : 'text-text-muted hover:text-text-main'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Mão de Obra / Serviço
        </button>
      </div>

      {tab === 'peca' ? (
        <div className="space-y-3">
          <Input
            placeholder="Buscar peça por nome ou SKU..."
            value={searchPart}
            onChange={(e) => setSearchPart(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            autoFocus
          />

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {filteredParts.map((part) => (
              <div
                key={part.id}
                onClick={() => handleSelectPart(part)}
                className="p-3 bg-surface border border-border/80 hover:border-primary rounded-xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
              >
                <div>
                  <h4 className="text-sm font-semibold text-text-main">{part.nome}</h4>
                  <p className="text-xs text-text-muted">
                    SKU: {part.codigo_sku || 'N/A'} • Estoque: {part.quantidade_estoque} un
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-display text-primary">
                    {formatBRL(part.preco_unitario)}
                  </span>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 justify-end mt-0.5">
                    <Plus className="w-3 h-3" /> Selecionar
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-text-muted text-center mb-2">Não encontrou a peça?</p>
            <Button
              variant="secondary"
              fullWidth
              size="sm"
              onClick={() => {
                setDescricao(searchPart);
                setTab('servico');
              }}
            >
              Criar Item Customizado
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddCustom} className="space-y-3">
          <Input
            label="Descrição do Serviço ou Peça"
            placeholder="Ex: Troca de pastilhas dianteiras"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            leftIcon={<Wrench className="w-4 h-4" />}
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Quantidade"
              type="number"
              inputMode="numeric"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
            />
            <Input
              label="Valor Unitário (R$)"
              placeholder="0,00"
              inputMode="decimal"
              value={valorUnitario}
              onChange={(e) => setValorUnitario(e.target.value)}
            />
          </div>

          <div className="pt-3">
            <Button type="submit" variant="primary" fullWidth hapticType="success">
              Adicionar Item à OS
            </Button>
          </div>
        </form>
      )}
    </BottomSheet>
  );
};
