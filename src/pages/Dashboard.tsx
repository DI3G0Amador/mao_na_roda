import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { osService } from '@/services/osService';
import { OrdemServico, StatusOS, DashboardStats } from '@/types';
import { Header } from '@/components/shared/Header';
import { BottomNav } from '@/components/shared/BottomNav';
import { HeroStatsSlider } from '@/components/shared/HeroStatsSlider';
import { VehicleCard } from '@/components/os/VehicleCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Plus, Car, RefreshCw } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();

  const [osList, setOsList] = useState<OrdemServico[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    osAbertas: 0,
    aguardandoAprovacao: 0,
    faturamentoMes: 0,
    veiculosNoPatio: 0,
  });
  const [searchPlaca, setSearchPlaca] = useState('');
  const [activeTab, setActiveTab] = useState<StatusOS | 'todas'>('todas');

  const loadData = () => {
    const list = osService.getOSList();
    setOsList(list);
    setStats(osService.getStats());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchPlaca(query);
    if (query.trim()) {
      setOsList(osService.searchByPlaca(query));
    } else {
      setOsList(osService.getOSList());
    }
  };

  const filteredList = osList.filter((os) => {
    if (activeTab === 'todas') return true;
    return os.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 md:pb-8">
      {/* Header PWA & Desktop */}
      <Header />

      {/* Main Container Responsive Compact */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-4 space-y-4">
        {/* Compact Hero Stats Cards */}
        <HeroStatsSlider stats={stats} />

        {/* Search Bar & Filters Header Compact */}
        <div className="bg-surface-card border border-border p-3.5 md:p-4 rounded-2xl space-y-3 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Quick Search Bar by License Plate / Client */}
            <div className="relative flex-1">
              <Input
                placeholder="Digite a placa (ex: BRA2E19), modelo do veículo ou cliente..."
                value={searchPlaca}
                onChange={handleSearchChange}
                leftIcon={<Search className="w-5 h-5 text-primary" />}
                className="bg-surface border-primary/40 font-mono tracking-wide text-base md:text-base py-2.5 focus:ring-primary shadow-inner"
              />
              {searchPlaca && (
                <button
                  onClick={() => {
                    setSearchPlaca('');
                    loadData();
                  }}
                  className="absolute right-3 top-2.5 text-xs text-text-muted hover:text-text-main px-2 py-0.5 bg-surface-card rounded border border-border"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Refresh & Desktop Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="px-3 py-2 text-text-muted hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-display uppercase tracking-wider bg-surface rounded-xl border border-border min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Atualizar</span>
              </button>
              <Button
                variant="primary"
                onClick={() => navigate('/os/nova')}
                className="hidden md:flex items-center gap-1.5"
              >
                <Plus className="w-5 h-5 stroke-[3]" /> Nova OS
              </Button>
            </div>
          </div>

          {/* Status Filters Horizontal Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none text-xs font-display uppercase tracking-wider">
            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('todas');
              }}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap border transition-all ${
                activeTab === 'todas'
                  ? 'bg-primary text-black font-bold border-primary shadow-md'
                  : 'bg-surface text-text-muted border-border hover:text-text-main'
              }`}
            >
              Todos os Veículos ({osList.length})
            </button>
            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('em_diagnostico');
              }}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap border transition-all ${
                activeTab === 'em_diagnostico'
                  ? 'bg-amber-500/20 text-amber-400 font-bold border-amber-500'
                  : 'bg-surface text-text-muted border-border hover:text-text-main'
              }`}
            >
              Em Diagnóstico
            </button>
            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('aguardando_aprovacao');
              }}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap border transition-all ${
                activeTab === 'aguardando_aprovacao'
                  ? 'bg-yellow-500/20 text-yellow-400 font-bold border-yellow-500'
                  : 'bg-surface text-text-muted border-border hover:text-text-main'
              }`}
            >
              Aguardando Aprovação
            </button>
            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('concluido');
              }}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap border transition-all ${
                activeTab === 'concluido'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold border-emerald-500'
                  : 'bg-surface text-text-muted border-border hover:text-text-main'
              }`}
            >
              Concluído / Pronto
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-base md:text-lg font-bold font-display uppercase tracking-wider text-text-main flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Veículos em Atendimento ({filteredList.length})
          </h2>
        </div>

        {/* Vehicle Cards Grid */}
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredList.map((os) => (
              <VehicleCard key={os.id} os={os} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-surface-card border border-border rounded-2xl space-y-3">
            <Car className="w-12 h-12 text-text-muted/40 mx-auto" />
            <h3 className="text-base font-bold font-display text-text-main">
              Nenhum veículo encontrado
            </h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Não encontramos Ordens de Serviço com os parâmetros pesquisados.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/os/nova')}
              className="mt-1 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Criar Nova OS
            </Button>
          </div>
        )}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNav />
    </div>
  );
};
