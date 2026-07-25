import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { osService } from '@/services/osService';
import { Store, Phone, User, MapPin, CheckCircle2, Navigation, Loader2 } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

interface RegisterOficinaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterOficinaModal: React.FC<RegisterOficinaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();

  const [nomeOficina, setNomeOficina] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [cidade, setCidade] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  // Auto-detect city via IP or GPS on modal open
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
      // Ignore fallback if network blocks IP API
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
        // Fallback to IP if GPS permission is denied
        detectCityByIP();
      },
      { timeout: 8000 }
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeOficina.trim()) return;

    triggerHaptic('success');
    setLoading(true);

    const cleanWa = whatsapp.replace(/\D/g, '');
    const formattedWa = cleanWa.startsWith('55') ? cleanWa : `55${cleanWa}`;
    const slug = nomeOficina.toLowerCase().replace(/[^a-z0-9]/g, '-');

    osService.registerNewOficina({
      nome: nomeOficina.trim(),
      slug,
      whatsapp: formattedWa || '5511999999999',
      endereco: cidade.trim() ? cidade.trim() : 'Brasil',
    });

    setTimeout(() => {
      setLoading(false);
      onClose();
      navigate('/patio');
    }, 600);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="🚀 Cadastrar Minha Oficina"
      subtitle="Crie a conta da sua oficina em menos de 1 minuto"
    >
      <form onSubmit={handleRegister} className="space-y-4 pt-2">
        <Input
          label="Nome da Oficina *"
          placeholder="Ex: Oficina Rústica Auto Center"
          value={nomeOficina}
          onChange={(e) => setNomeOficina(e.target.value)}
          leftIcon={<Store className="w-5 h-5 text-primary" />}
          autoFocus
        />

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
          helperText="Os comprovantes e orçamentos serão enviados por este número"
        />

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

        <div className="pt-3">
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
                <CheckCircle2 className="w-5 h-5" /> Criar Oficina & Começar
              </span>
            )}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};
