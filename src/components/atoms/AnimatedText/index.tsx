import React from 'react';
import './index.scss';

export interface AnimatedTextProps {
  /**
   * Text to animate
   */
  text: string;
  /**
   * Custom className for styling
   */
  className?: string;
}

/**
 * AnimatedText - Atom component for wave-animated text
 * Used for loading states like "Generating...", "Analysing..."
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = 'animated-text',
}) => {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </span>
  );
};
