import React, { useState, useEffect } from 'react';
import { osService } from '@/services/osService';
import { Peca } from '@/types';
import { formatBRL } from '@/lib/utils';
import { Header } from '@/components/shared/Header';
import { BottomNav } from '@/components/shared/BottomNav';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Package, Search, Plus, Tag } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

export const EstoquePage: React.FC = () => {
  const { triggerHaptic } = useHaptic();
  const [parts, setParts] = useState<Peca[]>([]);
  const [search, setSearch] = useState('');
  const [showAddPart, setShowAddPart] = useState(false);

  // New Part form
  const [nome, setNome] = useState('');
  const [sku, setSku] = useState('');
  const [preco, setPreco] = useState('');
  const [qtd, setQtd] = useState('10');

  const loadParts = () => {
    setParts(osService.getParts());
  };

  useEffect(() => {
    loadParts();
  }, []);

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    osService.savePart({
      nome: nome.trim(),
      codigo_sku: sku.trim() || undefined,
      preco_unitario: parseFloat(preco.replace(',', '.')) || 0,
      quantidade_estoque: parseInt(qtd) || 0,
    });

    triggerHaptic('success');
    setNome('');
    setSku('');
    setPreco('');
    setQtd('10');
    setShowAddPart(false);
    loadParts();
  };

  const filtered = parts.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      (p.codigo_sku && p.codigo_sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 md:pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display uppercase tracking-wider flex items-center gap-2 text-primary">
            <Package className="w-6 h-6" /> Estoque de Peças ({parts.length})
          </h2>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              triggerHaptic('light');
              setShowAddPart(true);
            }}
            className="gap-1.5"
          >
            <Plus className="w-5 h-5" /> Nova Peça
          </Button>
        </div>

        <div className="max-w-xl">
          <Input
            placeholder="Buscar peça por nome ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-5 h-5 text-text-muted" />}
          />
        </div>

        {/* Responsive Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {filtered.length > 0 ? (
            filtered.map((part) => (
              <div
                key={part.id}
                className="bg-surface-card border border-border rounded-2xl p-5 flex items-center justify-between shadow-md hover:border-primary/50 transition-all"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-text-main">{part.nome}</h3>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="font-mono">SKU: {part.codigo_sku || 'N/A'}</span>
                    <span className="bg-surface px-2 py-0.5 rounded border border-border">
                      Estoque: <strong className="text-text-main">{part.quantidade_estoque} un</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold font-display text-primary">
                    {formatBRL(part.preco_unitario)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center bg-surface-card border border-border rounded-2xl">
              <Package className="w-12 h-12 text-text-muted/40 mx-auto mb-3" />
              <p className="text-sm text-text-muted">Nenhuma peça encontrada.</p>
            </div>
          )}
        </div>
      </main>

      <BottomSheet
        isOpen={showAddPart}
        onClose={() => setShowAddPart(false)}
        title="+ Cadastrar Nova Peça no Estoque"
      >
        <form onSubmit={handleAddPart} className="space-y-4 pt-2">
          <Input
            label="Nome da Peça *"
            placeholder="Ex: Filtro de Combustível Bosch"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoFocus
          />
          <Input
            label="Código SKU / Referência"
            placeholder="Ex: FIL-BOSCH-01"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            leftIcon={<Tag className="w-4 h-4" />}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Preço de Venda (R$) *"
              placeholder="0,00"
              inputMode="decimal"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
            <Input
              label="Qtd em Estoque"
              type="number"
              inputMode="numeric"
              value={qtd}
              onChange={(e) => setQtd(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" fullWidth hapticType="success" className="mt-2">
            Salvar Peça no Estoque
          </Button>
        </form>
      </BottomSheet>

      <BottomNav />
    </div>
  );
};
