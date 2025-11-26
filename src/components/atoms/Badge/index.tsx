import React from 'react';
import './index.scss';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return <span className={`badge ${className}`}>{children}</span>;
};
