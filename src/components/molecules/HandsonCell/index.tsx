import React, { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { Input } from '@/components/atoms';
import type { InputRef } from 'antd';

interface HandsonCellProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
  type?: 'text' | 'dropdown' | 'textarea';
  options?: string[];
  readOnly?: boolean;
  autoFocus?: boolean;
}

/**
 * HandsonCell molecule component
 *
 * Editable cell for HandsonTable with keyboard navigation support.
 * Refactored to use Input atom and simplified keyboard handling.
 *
 * @example
 * ```tsx
 * <HandsonCell
 *   value={cellValue}
 *   onChange={handleChange}
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 *   onNavigateNext={handleNext}
 *   type="text"
 * />
 * ```
 */
export const HandsonCell: React.FC<HandsonCellProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  onNavigateNext,
  onNavigatePrevious,
  type = 'text',
  options = [],
  readOnly = false,
  autoFocus = true,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<InputRef | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectRef = useRef<any>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (autoFocus) {
      // Focus the input after a small delay to ensure it's rendered
      setTimeout(() => {
        if (type === 'dropdown' && selectRef.current) {
          selectRef.current?.focus();
        } else if (inputRef.current) {
          inputRef.current?.select();
        }
      }, 50);
    }
  }, [autoFocus, type]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Arrow Left for navigation (both text and dropdown)
    if (e.key === 'ArrowLeft') {
      if (type === 'text') {
        const input = e.target as HTMLInputElement;
        if (input.selectionStart === 0 && input.selectionEnd === 0) {
          // Cursor at start, navigate to previous cell
          e.preventDefault();
          onChange(localValue);
          onSave();
          if (onNavigatePrevious) {
            setTimeout(() => {
              onNavigatePrevious();
            }, 100);
          }
        }
      }
      // For dropdown, let Ant Design handle arrow keys for navigation in options
    } else if (e.key === 'ArrowRight') {
      if (type === 'text') {
        const input = e.target as HTMLInputElement;
        if (
          input.selectionStart === localValue.length &&
          input.selectionEnd === localValue.length
        ) {
          // Cursor at end, navigate to next cell
          e.preventDefault();
          onChange(localValue);
          onSave();
          if (onNavigateNext) {
            setTimeout(() => {
              onNavigateNext();
            }, 100);
          }
        }
      }
      // For dropdown, let Ant Design handle arrow keys for navigation in options
    } else if (e.key === 'Enter' && !e.shiftKey) {
      // For dropdown, don't prevent default - let Select handle Enter to select item
      // The selection will trigger handleDropdownChange which will save and navigate
      if (type === 'dropdown') {
        // Do nothing, let Select handle it, but prevent bubbling
        e.stopPropagation();
        return;
      }

      // For text input, prevent default, save and navigate to next cell
      e.preventDefault();
      onChange(localValue);
      onSave();

      // Navigate to next cell (same as Tab behavior)
      if (onNavigateNext) {
        setTimeout(() => {
          onNavigateNext();
        }, 100);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setLocalValue(value);
      onCancel();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      onChange(localValue);
      onSave();
      // Navigate to next cell (may create new row if at the end)
      if (onNavigateNext) {
        setTimeout(() => {
          onNavigateNext();
        }, 100);
      }
    }
  };

  const handleBlur = () => {
    onChange(localValue);
    onSave();
  };

  const handleDropdownChange = (val: string) => {
    setLocalValue(val);
    // Auto-save and navigate when selecting from dropdown
    onChange(val);
    setTimeout(() => {
      onSave();
      // Wait a bit longer for data to update before navigating
      if (onNavigateNext) {
        setTimeout(() => {
          onNavigateNext();
        }, 50);
      }
    }, 100);
  };

  if (readOnly) {
    return <div className="handson-cell-readonly">{value || '-'}</div>;
  }

  if (type === 'dropdown') {
    const selectOptions: SelectProps['options'] = options.map((opt) => ({
      label: opt,
      value: opt,
    }));

    return (
      <Select
        ref={selectRef}
        value={localValue || undefined}
        onChange={handleDropdownChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        options={selectOptions}
        placeholder="Select..."
        style={{ width: '100%' }}
        showSearch
        filterOption={(input, option) =>
          String(option?.label ?? '')
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        open={true}
        autoFocus={autoFocus}
      />
    );
  }

  return (
    <Input
      ref={inputRef}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      autoFocus={autoFocus}
    />
  );
};
