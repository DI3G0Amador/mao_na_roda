import React, { useRef } from 'react';
import { VistoriaFoto, CategoriaFoto } from '@/types';
import { ScannerAnimation } from '@/components/ui/ScannerAnimation';
import { Button } from '@/components/ui/Button';
import { Trash2, AlertCircle, Gauge, Circle, Image as ImageIcon } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

interface InspectionPhotoGridProps {
  photos: VistoriaFoto[];
  onAddPhoto: (photo: VistoriaFoto) => void;
  onRemovePhoto: (id: string) => void;
}

export const InspectionPhotoGrid: React.FC<InspectionPhotoGridProps> = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { triggerHaptic } = useHaptic();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    triggerHaptic('medium');
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const url = event.target?.result as string;
      const newPhoto: VistoriaFoto = {
        id: `vis-${Date.now()}`,
        url,
        categoria: 'avaria',
        descricao: 'Foto tirada na vistoria de entrada',
        data_criacao: new Date().toISOString(),
      };
      onAddPhoto(newPhoto);
    };

    reader.readAsDataURL(file);
  };

  const handleSimulatedCapture = () => {
    // Fallback sample photos if camera input is not activated or for testing fast preview
    const samples = [
      { url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop', cat: 'painel_km' as CategoriaFoto, desc: 'Painel com KM' },
      { url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop', cat: 'avaria' as CategoriaFoto, desc: 'Avaria na lateral' },
      { url: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?q=80&w=600&auto=format&fit=crop', cat: 'pneu' as CategoriaFoto, desc: 'Estado do Pneu' },
    ];
    const picked = samples[photos.length % samples.length];

    triggerHaptic('success');
    const newPhoto: VistoriaFoto = {
      id: `vis-${Date.now()}`,
      url: picked.url,
      categoria: picked.cat,
      descricao: picked.desc,
      data_criacao: new Date().toISOString(),
    };
    onAddPhoto(newPhoto);
  };

  const getCategoryBadge = (cat: CategoriaFoto) => {
    switch (cat) {
      case 'painel_km':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"><Gauge className="w-3 h-3" /> Painel KM</span>;
      case 'avaria':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Avaria/Risco</span>;
      case 'pneu':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"><Circle className="w-3 h-3" /> Pneu</span>;
      default:
        return <span className="bg-zinc-500/20 text-zinc-300 border border-zinc-500/30 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Geral</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input for Native Camera on Mobile */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Scanner Action Component */}
      <ScannerAnimation
        label="Tirar Foto para Vistoria Visual"
        onCapture={() => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          } else {
            handleSimulatedCapture();
          }
        }}
      />

      {/* Quick Trigger Button for Simulated Capture */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          📷 Usar Câmera
        </Button>
        <Button
          type="button"
          variant="ghost"
          fullWidth
          size="sm"
          onClick={handleSimulatedCapture}
        >
          ⚡ Foto de Exemplo
        </Button>
      </div>

      {/* Photos Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group rounded-xl overflow-hidden border border-border bg-surface shadow-md"
            >
              <img
                src={photo.url}
                alt={photo.descricao}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  {getCategoryBadge(photo.categoria)}
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('warning');
                      onRemovePhoto(photo.id);
                    }}
                    className="p-1.5 rounded-full bg-red-600/80 text-white hover:bg-red-700 min-h-[32px] min-w-[32px] flex items-center justify-center shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-zinc-200 line-clamp-1 font-sans">
                  {photo.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-surface/40 border border-border/50 rounded-2xl">
          <p className="text-xs text-text-muted">
            Nenhuma foto adicionada ainda. Tire fotos do painel (KM) e avarias para resguardo jurídico.
          </p>
        </div>
      )}
    </div>
  );
};
