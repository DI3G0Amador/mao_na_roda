import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { osService } from '@/services/osService';
import { Mail, Lock, LogIn, Store, AlertCircle } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
}) => {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setErrorMessage('');
    setLoading(true);
    triggerHaptic('medium');

    const result = await osService.loginUser({
      email: email.trim(),
      senha,
    });

    setLoading(false);

    if (result.success) {
      triggerHaptic('success');
      onClose();
      navigate('/patio');
    } else {
      triggerHaptic('warning');
      setErrorMessage(result.message || 'E-mail ou senha incorretos.');
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="🔑 Entrar na Minha Oficina"
      subtitle="Digite suas credenciais de acesso para entrar no sistema"
    >
      <form onSubmit={handleLogin} className="space-y-4 pt-2">
        {errorMessage && (
          <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 flex-none" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Input
          label="E-mail de Acesso *"
          placeholder="Ex: contato@oficinarustica.com"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-5 h-5 text-primary" />}
          autoFocus
        />

        <Input
          label="Senha de Acesso *"
          placeholder="Sua senha de 6 dígitos ou mais"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          leftIcon={<Lock className="w-5 h-5 text-primary" />}
        />

        {/* Demo Credentials Tip */}
        <div className="p-3 bg-surface border border-border rounded-xl text-[11px] text-text-muted space-y-1">
          <p className="font-bold text-text-main flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-primary" /> Credenciais para Teste (Oficina Rústica):
          </p>
          <p className="font-mono text-[10px]">
            E-mail: <strong className="text-amber-400">admin@oficinarustica.com</strong>
          </p>
          <p className="font-mono text-[10px]">
            Senha: <strong className="text-amber-400">123456</strong>
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={loading}
            hapticType="success"
            className="gap-2 text-base font-bold shadow-xl glow-primary"
          >
            {loading ? (
              <span>Entrando...</span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-5 h-5" /> Entrar na Oficina
              </span>
            )}
          </Button>

          {onSwitchToRegister && (
            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-xs text-text-muted hover:text-primary transition-colors font-mono"
              >
                Ainda não cadastrou sua oficina? <strong className="text-text-main underline">Cadastrar Agora</strong>
              </button>
            </div>
          )}
        </div>
      </form>
    </BottomSheet>
  );
};
