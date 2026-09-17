import React from 'react';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[18px] border border-[var(--color-border)] shadow-soft overflow-hidden ${
        hoverEffect ? 'hover:shadow-premium hover:border-[var(--color-accent-light)] transition-all duration-300 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
