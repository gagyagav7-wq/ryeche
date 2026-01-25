import React from 'react';

interface BrutCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const BrutCard = ({ children, className = "", title }: BrutCardProps) => {
  return (
    <div className={`bg-surface border-brut border-main shadow-brut p-6 ${className}`}>
      {title && (
        <div className="border-b-brut border-main pb-2 mb-4">
          <h3 className="font-black text-xl uppercase tracking-tighter">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default BrutCard;
