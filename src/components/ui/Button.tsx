import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  hapticType = 'light',
  className,
  children,
  onClick,
  disabled,
  ...props
}) => {
  const { triggerHaptic } = useHaptic();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      triggerHaptic(hapticType);
      if (onClick) onClick(e);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center font-medium font-display tracking-wide rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:select-none touch-manipulation min-h-[48px]';

  const variants = {
    primary: 'bg-primary text-black font-semibold hover:bg-primary-hover shadow-lg glow-primary-sm',
    secondary: 'bg-surface-card border border-border text-text-main hover:bg-surface hover:border-steel/40',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'text-text-muted hover:text-text-main hover:bg-surface-card/60',
    danger: 'bg-red-600/90 text-white hover:bg-red-700',
    success: 'bg-success text-black font-semibold hover:bg-emerald-600 shadow-md',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-5 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[56px]',
    icon: 'p-3 w-12 h-12 min-h-[48px] min-w-[48px]',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
