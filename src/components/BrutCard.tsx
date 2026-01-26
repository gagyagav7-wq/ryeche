import React from 'react';

interface BrutCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  noPadding?: boolean;
}

const BrutCard = ({ 
  children, 
  className = "", 
  title,
  noPadding = false
}: BrutCardProps) => {
  return (
    <div className={`bg-surface border-brut border-main shadow-brut relative overflow-hidden ${className}`}>
      {title && (
        <div className="border-b-brut border-main p-4 bg-white/50">
          <h3 className="font-black text-lg md:text-xl uppercase tracking-tighter truncate">
            {title}
          </h3>
        </div>
      )}
      <div className={noPadding ? '' : 'p-4 md:p-6'}>
        {children}
      </div>
    </div>
  );
};

export default BrutCard;
