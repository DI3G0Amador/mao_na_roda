import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { osService } from '@/services/osService';
import { Store, Phone, User, MapPin, CheckCircle2 } from 'lucide-react';
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
      endereco: cidade.trim() ? `${cidade.trim()}, SP` : 'Brasil',
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

        <Input
          label="Cidade / Estado (Opcional)"
          placeholder="Ex: São Paulo - SP"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          leftIcon={<MapPin className="w-5 h-5 text-text-muted" />}
        />

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
