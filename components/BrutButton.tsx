import React from 'react';

interface BrutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const BrutButton = ({ children, variant = 'primary', className = "", ...props }: BrutButtonProps) => {
  const baseStyles = "border-brut border-main font-bold py-3 px-6 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none hover:-translate-y-1 hover:translate-x-0 hover:shadow-brut-lg";
  
  const variants = {
    primary: "bg-accent shadow-brut text-main",
    secondary: "bg-white shadow-brut text-main",
    danger: "bg-accent-2 shadow-brut text-main",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default BrutButton;
