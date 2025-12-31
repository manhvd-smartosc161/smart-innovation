import React from 'react';
import { Input } from 'antd';
import type {
  TextAreaProps as AntTextAreaProps,
  TextAreaRef,
} from 'antd/es/input/TextArea';
import './index.scss';

const { TextArea: AntTextArea } = Input;

export interface TextAreaProps extends Omit<AntTextAreaProps, 'size'> {
  /**
   * TextArea size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * TextArea value
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
   * Whether the textarea is disabled
   */
  disabled?: boolean;
  /**
   * Whether the textarea is read-only
   */
  readOnly?: boolean;
  /**
   * Whether to show error state
   */
  error?: boolean;
  /**
   * Number of rows
   */
  rows?: number;
  /**
   * Maximum number of rows (for auto-resize)
   */
  maxRows?: number;
  /**
   * Minimum number of rows (for auto-resize)
   */
  minRows?: number;
  /**
   * Whether to auto-resize
   */
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  /**
   * Maximum length of input
   */
  maxLength?: number;
  /**
   * Whether to show character count
   */
  showCount?: boolean;
  /**
   * Change handler
   */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * Blur handler
   */
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * Focus handler
   */
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * Key down handler
   */
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Whether to auto-focus the textarea
   */
  autoFocus?: boolean;
}

/**
 * TextArea atom component
 *
 * A customized textarea component that wraps Ant Design's TextArea
 * with project-specific styling and validation states.
 *
 * @example
 * ```tsx
 * <TextArea
 *   placeholder="Enter description"
 *   value={value}
 *   onChange={handleChange}
 *   rows={4}
 *   showCount
 *   maxLength={500}
 * />
 * ```
 */
export const TextArea = React.forwardRef<TextAreaRef, TextAreaProps>(
  (
    {
      size = 'medium',
      error = false,
      className = '',
      disabled = false,
      readOnly = false,
      rows = 3,
      autoSize = false,
      showCount = false,
      ...rest
    },
    ref
  ) => {
    const classNames = [
      'atom-textarea',
      `atom-textarea--${size}`,
      error ? 'atom-textarea--error' : '',
      disabled ? 'atom-textarea--disabled' : '',
      readOnly ? 'atom-textarea--readonly' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <AntTextArea
        ref={ref}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        autoSize={autoSize}
        showCount={showCount}
        className={classNames}
        status={error ? 'error' : undefined}
        {...rest}
      />
    );
  }
);

TextArea.displayName = 'TextArea';
