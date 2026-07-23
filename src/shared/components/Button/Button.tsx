/** Button standardizza aspetto e semantica, lasciando l'evento al chiamante. */
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
};

export function Button({
  icon,
  variant = 'primary',
  children,
  className,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      className={['button', className].filter(Boolean).join(' ')}
      data-variant={variant}
      type={type}
    >
      {icon}
      {children}
    </button>
  );
}