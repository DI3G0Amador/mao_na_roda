import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Plus, Users, Package } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerHaptic } = useHaptic();

  const handleNavigate = (path: string) => {
    triggerHaptic('light');
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-border px-4 py-2 flex items-center justify-around max-w-lg mx-auto shadow-2xl md:hidden">
      {/* Tab 1: Início */}
      <button
        onClick={() => handleNavigate('/patio')}
        className={`flex flex-col items-center justify-center py-1 px-3 min-h-[48px] transition-colors ${
          location.pathname === '/patio' ? 'text-primary font-bold' : 'text-text-muted hover:text-text-main'
        }`}
      >
        <Car className="w-5 h-5" />
        <span className="text-[11px] font-display uppercase tracking-wider mt-1">Início</span>
      </button>

      {/* Center FAB: + Nova OS */}
      <div className="relative -top-5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleNavigate('/os/nova')}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-primary to-amber-400 text-black flex flex-col items-center justify-center shadow-lg shadow-primary/40 border-2 border-background glow-primary min-h-[56px] min-w-[56px]"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
        </motion.button>
      </div>

      {/* Tab 2: Estoque */}
      <button
        onClick={() => handleNavigate('/estoque')}
        className={`flex flex-col items-center justify-center py-1 px-3 min-h-[48px] transition-colors ${
          location.pathname === '/estoque' ? 'text-primary font-bold' : 'text-text-muted hover:text-text-main'
        }`}
      >
        <Package className="w-5 h-5" />
        <span className="text-[11px] font-display uppercase tracking-wider mt-1">Estoque</span>
      </button>

      {/* Tab 3: Clientes */}
      <button
        onClick={() => handleNavigate('/clientes')}
        className={`flex flex-col items-center justify-center py-1 px-3 min-h-[48px] transition-colors ${
          location.pathname === '/clientes' ? 'text-primary font-bold' : 'text-text-muted hover:text-text-main'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[11px] font-display uppercase tracking-wider mt-1">Clientes</span>
      </button>
    </div>
  );
};
