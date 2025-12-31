import React from 'react';
import { Select as AntSelect } from 'antd';
import type { SelectProps as AntSelectProps, RefSelectProps } from 'antd';
import './index.scss';

export interface SelectOption {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T = string> {
  /**
   * Select size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Select options
   */
  options?: SelectOption[];
  /**
   * Selected value
   */
  value?: T;
  /**
   * Default value
   */
  defaultValue?: T;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show error state
   */
  error?: boolean;
  /**
   * Whether to allow multiple selection
   */
  mode?: 'multiple' | 'tags';
  /**
   * Whether to show search
   */
  showSearch?: boolean;
  /**
   * Whether to allow clear
   */
  allowClear?: boolean;
  /**
   * Change handler
   */
  onChange?: (value: T) => void;
  /**
   * Blur handler
   */
  onBlur?: () => void;
  /**
   * Focus handler
   */
  onFocus?: () => void;
  /**
   * Search handler
   */
  onSearch?: (value: string) => void;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Custom filter option function
   */
  filterOption?: boolean | ((input: string, option?: SelectOption) => boolean);
}

/**
 * Select atom component
 *
 * A customized select component that wraps Ant Design's Select
 * with project-specific styling and consistent API.
 *
 * @example
 * ```tsx
 * <Select
 *   placeholder="Select an option"
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' },
 *   ]}
 *   value={value}
 *   onChange={handleChange}
 * />
 * ```
 */
export const Select = React.forwardRef<RefSelectProps, SelectProps>(
  (
    {
      size = 'medium',
      error = false,
      className = '',
      disabled = false,
      showSearch = false,
      allowClear = false,
      loading = false,
      options = [],
      ...rest
    },
    ref
  ) => {
    // Map our sizes to Ant Design sizes
    const getAntSize = (): AntSelectProps['size'] => {
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
      'atom-select',
      `atom-select--${size}`,
      error ? 'atom-select--error' : '',
      disabled ? 'atom-select--disabled' : '',
      loading ? 'atom-select--loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <AntSelect
        ref={ref}
        size={getAntSize()}
        disabled={disabled}
        showSearch={showSearch}
        allowClear={allowClear}
        loading={loading}
        options={options}
        className={classNames}
        status={error ? 'error' : undefined}
        {...rest}
      />
    );
  }
);

Select.displayName = 'Select';

// Export Option component for backward compatibility
export const SelectOption = AntSelect.Option;
