import React from 'react';
import './index.scss';

export interface FireworksAnimationProps {
  /**
   * Whether to show the fireworks animation
   */
  show: boolean;
  /**
   * Number of fireworks to display
   * @default 12
   */
  count?: number;
}

/**
 * FireworksAnimation - Molecule component for celebration fireworks effect
 * Used after successful operations like generating checklists, test cases, etc.
 */
export const FireworksAnimation: React.FC<FireworksAnimationProps> = ({
  show,
  count = 12,
}) => {
  if (!show) return null;

  return (
    <div className="fireworks-container">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`firework firework-${i + 1}`} />
      ))}
    </div>
  );
};
