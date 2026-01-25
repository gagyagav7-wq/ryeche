import React from 'react';
import Link from 'next/link';

// Kita pisahin props biar lebih strict
interface BaseProps {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

// Props buat Button beneran
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, BaseProps {
  href?: never; // Memastikan ga bisa pasang href di button biasa
}

// Props buat Link (mirip <a>)
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, BaseProps {
  href: string; // Wajib ada href
}

// Union Type
type BrutButtonProps = ButtonProps | LinkProps;

const BrutButton = (props: BrutButtonProps) => {
  const { 
    children, 
    variant = 'primary', 
    className = "", 
    fullWidth = false,
    disabled = false,
    ...rest 
  } = props;

  // Style dasar
  const baseStyles = `
    inline-flex items-center justify-center
    border-brut border-main font-bold py-3 px-6 
    transition-transform duration-75
    
    /* State: Active (Click) - Tetap jalan di Mobile & PC */
    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none 
    
    /* State: Focus Keyboard */
    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-main/30
    
    /* State: Disabled */
    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0
    aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:shadow-none
    
    /* Typography */
    text-base md:text-lg tracking-tight
    
    /* Mobile Optimization */
    touch-manipulation 
    
    ${fullWidth ? 'w-full' : ''}
  `;

  // Apply class hover khusus PC (dari globals.css) cuma kalau TIDAK disabled
  const hoverClass = disabled ? '' : 'brut-hover-effect';

  const variants = {
    primary: "bg-accent shadow-brut text-main",
    secondary: "bg-surface shadow-brut text-main",
    danger: "bg-danger text-white shadow-brut",
  };

  const finalClass = `${baseStyles} ${variants[variant]} ${hoverClass} ${className}`;

  // 1. Render sebagai Link (Next.js)
  if ('href' in props && props.href) {
    const { href, ...linkRest } = rest as LinkProps;
    
    // Kalau disabled, kita render <span> atau <a> tanpa href biar ga bisa diklik
    if (disabled) {
      return (
        <span 
          className={finalClass} 
          aria-disabled="true"
        >
          {children}
        </span>
      );
    }

    return (
      <Link href={href} className={finalClass} {...linkRest}>
        {children}
      </Link>
    );
  }

  // 2. Render sebagai Button HTML biasa
  return (
    <button 
      className={finalClass} 
      disabled={disabled}
      type="button" // Default prevent form submit accidental
      {...(rest as ButtonProps)}
    >
      {children}
    </button>
  );
};

export default BrutButton;
