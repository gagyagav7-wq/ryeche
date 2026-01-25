import React from 'react';
import Link from 'next/link';

interface BrutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  href?: string; // Kalau diisi, render sebagai Link
  fullWidth?: boolean;
}

const BrutButton = ({ 
  children, 
  variant = 'primary', 
  className = "", 
  href, 
  fullWidth = false,
  ...props 
}: BrutButtonProps) => {
  
  // Base style + Accessibility (focus-visible) + Mobile Touch Target
  const baseStyles = `
    inline-flex items-center justify-center
    border-brut border-main font-bold py-3 px-6 
    transition-transform duration-75
    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none 
    hover:-translate-y-1 hover:translate-x-0 hover:shadow-brut-lg
    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-main/30
    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0
    text-base md:text-lg tracking-tight
    ${fullWidth ? 'w-full' : ''}
  `;
  
  const variants = {
    primary: "bg-accent shadow-brut text-main",
    secondary: "bg-surface shadow-brut text-main", // Pake warna 'Milk'
    danger: "bg-danger text-white shadow-brut", // Danger merah, text putih biar kontras
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  // Render sebagai Link Next.js kalau ada href
  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  // Render sebagai Button biasa
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default BrutButton;
