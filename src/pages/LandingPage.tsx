import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { RegisterOficinaModal } from '@/components/shared/RegisterOficinaModal';
import logoFull from '@/assets/logo-full.png';
import logoIcon from '@/assets/logo-icon.png';
import {
  Wrench,
  Smartphone,
  Camera,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Car,
  Store,
  Sparkles,
} from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleOpenRegister = () => {
    triggerHaptic('medium');
    setShowRegisterModal(true);
  };

  const handleDemoAccess = () => {
    triggerHaptic('light');
    navigate('/patio');
  };

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col justify-between selection:bg-primary selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/80 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-primary/40 glow-primary-sm">
              <img src={logoIcon} alt="Mão na Roda Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display uppercase tracking-wider text-text-main leading-none">
                Mão na Roda
              </h1>
              <p className="text-[10px] text-text-muted font-mono mt-0.5">
                Gestão de Oficina • Simples & Direto
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDemoAccess}
              className="text-xs font-display uppercase tracking-wider text-text-muted hover:text-text-main font-semibold px-3 py-2 rounded-xl hover:bg-surface-card transition-colors hidden sm:block"
            >
              Testar Sistema Demo
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenRegister}
              className="gap-1.5 shadow-lg font-bold text-xs"
            >
              <Store className="w-4 h-4" /> Cadastrar Oficina
            </Button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 space-y-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Gestão de Oficina sem Complicação</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display uppercase tracking-tight text-text-main leading-[1.1]">
              Organize os atendimentos e serviços da sua oficina <span className="text-primary underline decoration-primary/40">direto pelo celular</span>.
            </h1>

            <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Chega de papéis perdidos. Crie ordens de serviço em segundos, registre fotos da entrada do carro e envie comprovantes com <strong>garantia de 90 dias</strong> direto no WhatsApp do seu cliente.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleOpenRegister}
                hapticType="success"
                className="w-full sm:w-auto px-8 py-4 text-lg font-bold shadow-2xl glow-primary gap-2"
              >
                <Wrench className="w-6 h-6 stroke-[2.5]" />
                Cadastrar Minha Oficina
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={handleDemoAccess}
                className="w-full sm:w-auto px-6 py-4 text-base gap-2"
              >
                <Car className="w-5 h-5 text-primary" />
                Testar Sistema Agora
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Micro Feature Bullet Points */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-text-muted border-t border-border/60">
              <div className="flex items-center justify-center lg:justify-start gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pronto em 1 Minuto</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Celular & Computador</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5 font-mono col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Integração Supabase</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Banner */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-b from-surface-card via-surface to-background border-2 border-border/80 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="text-center pb-2 border-b border-border/60">
                <img
                  src={logoFull}
                  alt="Mão na Roda Logo"
                  className="h-32 mx-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* Sample Live Card */}
              <div className="bg-surface border border-primary/40 rounded-2xl p-4 space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-zinc-950 text-white font-mono font-bold px-2 py-0.5 rounded border border-zinc-700">
                    BRA-2E19
                  </span>
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold">
                    EM DIAGNÓSTICO
                  </span>
                </div>
                <h4 className="text-base font-bold text-text-main font-display">
                  Volkswagen Gol 1.6 MSI Flex
                </h4>
                <p className="text-xs text-text-muted italic">
                  "Ruído no freio dianteiro ao acionar o pedal"
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-border/40 text-xs font-bold font-display">
                  <span className="text-text-muted">Valor OS:</span>
                  <span className="text-primary text-base">R$ 480,00</span>
                </div>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <ShieldCheck className="w-5 h-5 flex-none" />
                <span>Garantia de 90 dias inclusa automaticamente no comprovante</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid (4 Cards) */}
        <div className="pt-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-wider text-text-main">
              Simples, Rápido e Eficiente
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Tudo o que você precisa para gerenciar seus veículos, clientes e peças de forma prática.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-card border border-border p-5 rounded-2xl space-y-3 hover:border-primary/50 transition-all">
              <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-primary w-fit">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-display text-text-main">
                Fácil no Celular
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Botões grandes e telas limpas para criar ordens de serviço rapidamente onde você estiver.
              </p>
            </div>

            <div className="bg-surface-card border border-border p-5 rounded-2xl space-y-3 hover:border-primary/50 transition-all">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 w-fit">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-display text-text-main">
                Fotos na Entrada
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Registre fotos do carro, KM do painel e detalhes na entrada para manter tudo documentado.
              </p>
            </div>

            <div className="bg-surface-card border border-border p-5 rounded-2xl space-y-3 hover:border-primary/50 transition-all">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 w-fit">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-display text-text-main">
                WhatsApp em 1 Clique
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Envie o resumo do orçamento ou serviço concluído direto no WhatsApp do seu cliente.
              </p>
            </div>

            <div className="bg-surface-card border border-border p-5 rounded-2xl space-y-3 hover:border-primary/50 transition-all">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 w-fit">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-display text-text-main">
                Tudo em Um Lugar
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Consulte rapidamente o histórico de clientes, veículos atendidos e peças no estoque.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center text-xs text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono">
            Mão na Roda — Gestão para Oficinas © 2026. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 font-display uppercase tracking-wider text-[11px]">
            <button onClick={handleDemoAccess} className="hover:text-primary transition-colors">
              Ver Sistema
            </button>
            <button onClick={handleOpenRegister} className="text-primary font-bold hover:underline">
              + Cadastrar Oficina
            </button>
          </div>
        </div>
      </footer>

      {/* Register Modal */}
      <RegisterOficinaModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </div>
  );
};
