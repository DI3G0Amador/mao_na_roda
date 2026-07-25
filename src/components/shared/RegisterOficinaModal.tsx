import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { osService } from '@/services/osService';
import { Store, Phone, User, MapPin, CheckCircle2, Navigation, Loader2, Mail, Lock } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

interface RegisterOficinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterOficinaModal: React.FC<RegisterOficinaModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();

  const [nomeOficina, setNomeOficina] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cidade, setCidade] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (isOpen && !cidade) {
      detectCityByIP();
    }
  }, [isOpen]);

  const detectCityByIP = async () => {
    try {
      setLocating(true);
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data.city && data.region_code) {
          setCidade(`${data.city} - ${data.region_code}`);
        }
      }
    } catch {
      // Ignore
    } finally {
      setLocating(false);
    }
  };

  const handleGPSLocation = () => {
    triggerHaptic('medium');
    if (!('geolocation' in navigator)) {
      alert('Geolocalização não é suportada neste navegador.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
          );
          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision;
            const uf = data.principalSubdivisionCode ? data.principalSubdivisionCode.replace('BR-', '') : 'SP';
            if (city) {
              setCidade(`${city} - ${uf}`);
              triggerHaptic('success');
            }
          }
        } catch {
          detectCityByIP();
        } finally {
          setLocating(false);
        }
      },
      () => {
        detectCityByIP();
      },
      { timeout: 8000 }
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeOficina.trim() || !email.trim() || !senha.trim()) {
      alert('Preencha os campos obrigatórios (*)');
      return;
    }

    if (senha.length < 6) {
      alert('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    triggerHaptic('success');
    setLoading(true);

    const cleanWa = whatsapp.replace(/\D/g, '');
    const formattedWa = cleanWa.startsWith('55') ? cleanWa : `55${cleanWa}`;

    await osService.registerNewOficina({
      nome: nomeOficina.trim(),
      whatsapp: formattedWa || '5511999999999',
      nomeResponsavel: nomeResponsavel.trim() || 'Admin da Oficina',
      email: email.trim(),
      senha,
      cidade: cidade.trim(),
    });

    setLoading(false);
    onClose();
    navigate('/patio');
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="🚀 Cadastrar Minha Oficina"
      subtitle="Crie a conta da sua oficina e defina seus dados de acesso"
    >
      <form onSubmit={handleRegister} className="space-y-3.5 pt-1">
        <Input
          label="Nome da Oficina *"
          placeholder="Ex: Oficina Rústica Auto Center"
          value={nomeOficina}
          onChange={(e) => setNomeOficina(e.target.value)}
          leftIcon={<Store className="w-5 h-5 text-primary" />}
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Seu Nome / Responsável *"
            placeholder="Ex: Roberto da Silva"
            value={nomeResponsavel}
            onChange={(e) => setNomeResponsavel(e.target.value)}
            leftIcon={<User className="w-5 h-5 text-text-muted" />}
          />
          <Input
            label="WhatsApp da Oficina (DDD + Número) *"
            placeholder="Ex: 11988776655"
            type="tel"
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            leftIcon={<Phone className="w-5 h-5 text-emerald-400" />}
          />
        </div>

        {/* Credentials for Admin Login */}
        <div className="p-3.5 bg-surface border border-primary/30 rounded-2xl space-y-3 shadow-inner">
          <span className="text-[11px] font-display uppercase tracking-wider font-bold text-primary block">
            🔑 Credenciais de Acesso (Login do Admin)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="E-mail de Acesso *"
              placeholder="Ex: contato@oficinarustica.com"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-primary" />}
            />
            <Input
              label="Senha de Acesso *"
              placeholder="Mínimo 6 caracteres"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-primary" />}
            />
          </div>
        </div>

        {/* Location Input with Auto-detect GPS button */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Cidade / Estado (Opcional)
            </label>
            <button
              type="button"
              onClick={handleGPSLocation}
              disabled={locating}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-mono font-semibold"
            >
              {locating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Buscando...
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" /> Detectar Minha Cidade
                </>
              )}
            </button>
          </div>
          <Input
            placeholder="Ex: São Paulo - SP"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            leftIcon={<MapPin className="w-5 h-5 text-text-muted" />}
          />
        </div>

        <div className="pt-2 space-y-2">
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
              <span>Criando Oficina...</span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Criar Oficina & Entrar
              </span>
            )}
          </Button>

          {onSwitchToLogin && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-xs text-text-muted hover:text-primary transition-colors font-mono"
              >
                Já tem uma oficina cadastrada? <strong className="text-text-main underline">Fazer Login</strong>
              </button>
            </div>
          )}
        </div>
      </form>
    </BottomSheet>
  );
};
