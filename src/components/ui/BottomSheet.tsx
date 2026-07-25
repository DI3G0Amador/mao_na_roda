import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  const { triggerHaptic } = useHaptic();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      triggerHaptic('light');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Sheet Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
            className="relative z-10 w-full max-w-lg bg-surface-card border-t border-border rounded-t-3xl p-5 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
          >
            {/* Top Drag handle pill */}
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-4 cursor-grab active:cursor-grabbing" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/60">
              <div>
                <h3 className="text-xl font-bold font-display text-text-main tracking-wide">
                  {title}
                </h3>
                {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full text-text-muted hover:text-text-main hover:bg-surface transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Container (Scrollable) */}
            <div className="overflow-y-auto flex-1 pr-1 pb-4">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
