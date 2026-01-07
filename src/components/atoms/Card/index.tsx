import React from 'react';
import './index.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

/**
 * Card component
 *
 * A reusable card component with consistent styling for padding, shadow, and border-radius.
 * Used across all sections for a unified design.
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = true,
}) => {
  return (
    <div className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}>
      {children}
    </div>
  );
};
