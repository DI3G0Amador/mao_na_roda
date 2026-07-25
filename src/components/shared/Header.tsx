import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wifi, WifiOff, ShieldCheck, Car, Package, Users, Plus, Store } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { useHaptic } from '@/hooks/useHaptic';
import { osService } from '@/services/osService';
import { Oficina } from '@/types';
import logoIcon from '@/assets/logo-icon.png';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerHaptic } = useHaptic();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const oficinas = osService.getOficinas();
  const [activeOficina, setActiveOficina] = useState<Oficina>(osService.getActiveOficina());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleNav = (path: string) => {
    triggerHaptic('light');
    navigate(path);
  };

  const handleOficinaChange = (oficinaId: string) => {
    triggerHaptic('medium');
    osService.setActiveOficina(oficinaId);
    const found = oficinas.find((o) => o.id === oficinaId);
    if (found) setActiveOficina(found);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Workshop Switcher */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => handleNav('/')}
            className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-primary/40 group-hover:border-primary transition-all glow-primary-sm flex-none cursor-pointer"
          >
            <img src={logoIcon} alt="Mão na Roda Logo" className="w-full h-full object-cover" />
          </div>

          <div className="space-y-0.5">
            <h1
              onClick={() => handleNav('/')}
              className="text-base sm:text-lg font-bold font-display uppercase tracking-wider leading-none text-text-main flex items-center gap-1.5 cursor-pointer"
            >
              Mão na Roda
            </h1>

            {/* Workshop Selector */}
            <div className="flex items-center gap-1 text-xs">
              <Store className="w-3 h-3 text-primary flex-none" />
              <select
                value={activeOficina.id}
                onChange={(e) => handleOficinaChange(e.target.value)}
                className="bg-transparent text-[11px] font-mono text-text-muted hover:text-text-main focus:outline-none cursor-pointer underline decoration-primary/40 truncate max-w-[180px] sm:max-w-[240px]"
                title="Trocar de Oficina"
              >
                {oficinas.map((of) => (
                  <option key={of.id} value={of.id} className="bg-surface-card text-text-main">
                    {of.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface/80 p-1 rounded-xl border border-border">
          <button
            onClick={() => handleNav('/patio')}
            className={`px-4 py-2 rounded-lg font-display uppercase tracking-wider text-xs font-semibold flex items-center gap-2 transition-all ${
              location.pathname === '/patio' || location.pathname === '/' ? 'bg-primary text-black shadow-md' : 'text-text-muted hover:text-text-main hover:bg-surface-card'
            }`}
          >
            <Car className="w-4 h-4" /> Início / Veículos
          </button>
          <button
            onClick={() => handleNav('/estoque')}
            className={`px-4 py-2 rounded-lg font-display uppercase tracking-wider text-xs font-semibold flex items-center gap-2 transition-all ${
              location.pathname === '/estoque' ? 'bg-primary text-black shadow-md' : 'text-text-muted hover:text-text-main hover:bg-surface-card'
            }`}
          >
            <Package className="w-4 h-4" /> Estoque
          </button>
          <button
            onClick={() => handleNav('/clientes')}
            className={`px-4 py-2 rounded-lg font-display uppercase tracking-wider text-xs font-semibold flex items-center gap-2 transition-all ${
              location.pathname === '/clientes' ? 'bg-primary text-black shadow-md' : 'text-text-muted hover:text-text-main hover:bg-surface-card'
            }`}
          >
            <Users className="w-4 h-4" /> Clientes
          </button>
        </nav>

        {/* Right Actions: + Nova OS Desktop Button & Connection Badge */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleNav('/os/nova')}
            className="hidden md:inline-flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Nova OS
          </Button>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="font-display uppercase tracking-wider text-[10px]">
              {isOnline ? (isSupabaseConfigured ? 'Supabase Sync' : 'Online Local') : 'Modo Offline'}
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-surface-card border border-border flex items-center justify-center text-text-muted hover:text-text-main transition-colors hidden sm:flex">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
};
