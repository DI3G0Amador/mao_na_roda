import React, { useState, useEffect } from 'react';
import { osService } from '@/services/osService';
import { Cliente } from '@/types';
import { Header } from '@/components/shared/Header';
import { BottomNav } from '@/components/shared/BottomNav';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { QuickClientSheet } from '@/components/os/QuickClientSheet';
import { Users, Search, Plus, MessageCircle, UserCheck } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

export const ClientesPage: React.FC = () => {
  const { triggerHaptic } = useHaptic();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);

  const loadClients = () => {
    setClients(osService.getClients());
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.whatsapp.includes(search) ||
      (c.cpf_cnpj && c.cpf_cnpj.includes(search))
  );

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 md:pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display uppercase tracking-wider flex items-center gap-2 text-primary">
            <Users className="w-6 h-6" /> Base de Clientes ({clients.length})
          </h2>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              triggerHaptic('light');
              setShowAddClient(true);
            }}
            className="gap-1.5"
          >
            <Plus className="w-5 h-5" /> Novo Cliente
          </Button>
        </div>

        <div className="max-w-xl">
          <Input
            placeholder="Buscar por nome, WhatsApp ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-5 h-5 text-text-muted" />}
          />
        </div>

        {/* Responsive Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {filtered.length > 0 ? (
            filtered.map((client) => (
              <div
                key={client.id}
                className="bg-surface-card border border-border rounded-2xl p-5 flex items-center justify-between shadow-md hover:border-primary/50 transition-all"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-steel" /> {client.nome}
                  </h3>
                  <p className="text-xs text-text-muted font-mono">
                    WhatsApp: {client.whatsapp}
                  </p>
                  {client.cpf_cnpj && (
                    <p className="text-xs text-text-muted/70">CPF/CNPJ: {client.cpf_cnpj}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${client.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition-colors"
                    title="Chamar no WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center bg-surface-card border border-border rounded-2xl">
              <Users className="w-12 h-12 text-text-muted/40 mx-auto mb-3" />
              <p className="text-sm text-text-muted">Nenhum cliente encontrado.</p>
            </div>
          )}
        </div>
      </main>

      <QuickClientSheet
        isOpen={showAddClient}
        onClose={() => setShowAddClient(false)}
        onClientCreated={() => loadClients()}
      />

      <BottomNav />
    </div>
  );
};
