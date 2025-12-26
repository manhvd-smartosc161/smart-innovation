import React from 'react';
import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps, InputRef } from 'antd';
import './index.scss';

export interface InputProps extends Omit<AntInputProps, 'size'> {
  /**
   * Input size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Input value
   */
  value?: string;
  /**
   * Default value
   */
  defaultValue?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Whether the input is read-only
   */
  readOnly?: boolean;
  /**
   * Whether to show error state
   */
  error?: boolean;
  /**
   * Change handler
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Blur handler
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Focus handler
   */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Key down handler
   */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Prefix icon or element
   */
  prefix?: React.ReactNode;
  /**
   * Suffix icon or element
   */
  suffix?: React.ReactNode;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Whether to auto-focus the input
   */
  autoFocus?: boolean;
  /**
   * Maximum length of input
   */
  maxLength?: number;
  /**
   * Input type
   */
  type?: string;
}

/**
 * Input atom component
 *
 * A customized input component that wraps Ant Design's Input
 * with project-specific styling and validation states.
 *
 * @example
 * ```tsx
 * <Input
 *   placeholder="Enter text"
 *   value={value}
 *   onChange={handleChange}
 *   error={hasError}
 * />
 * ```
 */
export const Input = React.forwardRef<InputRef, InputProps>(
  (
    {
      size = 'medium',
      error = false,
      className = '',
      disabled = false,
      readOnly = false,
      ...rest
    },
    ref
  ) => {
    // Map our sizes to Ant Design sizes
    const getAntSize = (): AntInputProps['size'] => {
      switch (size) {
        case 'small':
          return 'small';
        case 'large':
          return 'large';
        case 'medium':
        default:
          return 'middle';
      }
    };

    const classNames = [
      'atom-input',
      `atom-input--${size}`,
      error ? 'atom-input--error' : '',
      disabled ? 'atom-input--disabled' : '',
      readOnly ? 'atom-input--readonly' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <AntInput
        ref={ref}
        size={getAntSize()}
        disabled={disabled}
        readOnly={readOnly}
        className={classNames}
        status={error ? 'error' : undefined}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';
