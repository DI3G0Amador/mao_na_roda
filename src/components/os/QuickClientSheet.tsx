import React, { useState } from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Cliente } from '@/types';
import { osService } from '@/services/osService';
import { User, Phone, FileText } from 'lucide-react';

interface QuickClientSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: Cliente) => void;
}

export const QuickClientSheet: React.FC<QuickClientSheetProps> = ({
  isOpen,
  onClose,
  onClientCreated,
}) => {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('Informe o nome do cliente');
      return;
    }
    if (!whatsapp.trim()) {
      setError('Informe o WhatsApp do cliente');
      return;
    }

    const cleanWa = whatsapp.replace(/\D/g, '');
    const formattedWa = cleanWa.startsWith('55') ? cleanWa : `55${cleanWa}`;

    const newClient = osService.saveClient({
      nome: nome.trim(),
      whatsapp: formattedWa,
      telefone: whatsapp,
      cpf_cnpj: cpfCnpj.trim(),
    });

    onClientCreated(newClient);
    setNome('');
    setWhatsapp('');
    setCpfCnpj('');
    setError('');
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="+ Cadastro Rápido de Cliente"
      subtitle="Preencha apenas o essencial para emitir a Ordem de Serviço"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <Input
          label="Nome Completo / Razão Social"
          placeholder="Ex: João da Silva"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          autoFocus
          error={error && !nome ? error : undefined}
        />

        <Input
          label="WhatsApp (DDD + Número)"
          placeholder="Ex: 11988776655"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          type="tel"
          inputMode="tel"
          leftIcon={<Phone className="w-4 h-4" />}
          error={error && !whatsapp ? error : undefined}
        />

        <Input
          label="CPF / CNPJ (Opcional)"
          placeholder="Ex: 123.456.789-00"
          value={cpfCnpj}
          onChange={(e) => setCpfCnpj(e.target.value)}
          leftIcon={<FileText className="w-4 h-4" />}
        />

        <div className="pt-3 flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" fullWidth hapticType="success">
            Salvar & Selecionar
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};
