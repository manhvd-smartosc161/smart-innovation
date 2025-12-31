import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import './index.scss';

export interface ButtonProps
  extends Omit<AntButtonProps, 'size' | 'type' | 'variant'> {
  /**
   * Button variant
   * @default 'default'
   */
  variant?: 'primary' | 'default' | 'text' | 'link' | 'dashed';
  /**
   * Button size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether the button is in danger state
   */
  danger?: boolean;
  /**
   * Whether the button is in loading state
   */
  loading?: boolean;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Button content
   */
  children?: React.ReactNode;
  /**
   * Icon to display in the button
   */
  icon?: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * HTML button type
   */
  htmlType?: 'button' | 'submit' | 'reset';
}

/**
 * Button atom component
 *
 * A customized button component that wraps Ant Design's Button
 * with project-specific styling and consistent API.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      danger = false,
      loading = false,
      disabled = false,
      className = '',
      children,
      icon,
      onClick,
      htmlType = 'button',
      ...rest
    },
    ref
  ) => {
    // Map our sizes to Ant Design sizes
    const getAntSize = (): AntButtonProps['size'] => {
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

    // Map our variants to Ant Design types
    const getAntType = (): AntButtonProps['type'] => {
      switch (variant) {
        case 'primary':
          return 'primary';
        case 'dashed':
          return 'dashed';
        case 'text':
          return 'text';
        case 'link':
          return 'link';
        case 'default':
        default:
          return 'default';
      }
    };

    const classNames = [
      'atom-button',
      `atom-button--${variant}`,
      `atom-button--${size}`,
      danger ? 'atom-button--danger' : '',
      loading ? 'atom-button--loading' : '',
      disabled ? 'atom-button--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <AntButton
        ref={ref}
        type={getAntType()}
        size={getAntSize()}
        danger={danger}
        loading={loading}
        disabled={disabled}
        icon={icon}
        onClick={onClick}
        htmlType={htmlType}
        className={classNames}
        {...rest}
      >
        {children}
      </AntButton>
    );
  }
);

Button.displayName = 'Button';
