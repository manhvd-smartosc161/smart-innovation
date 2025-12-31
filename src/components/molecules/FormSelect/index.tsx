import React from 'react';
import { Form } from 'antd';
import { Select } from '@/components/atoms';
import './index.scss';

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name?: string;
  options: FormSelectOption[];
  span?: number;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  span,
}) => {
  return (
    <Form.Item
      label={label}
      name={name}
      className={span ? `form-select-span-${span}` : ''}
    >
      <Select options={options} />
    </Form.Item>
  );
};
