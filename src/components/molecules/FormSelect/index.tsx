import React from "react";
import { Form, Select } from "antd";
import "./index.scss";

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name?: string;
  defaultValue?: string;
  options: FormSelectOption[];
  span?: number;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  defaultValue,
  options,
  span,
}) => {
  return (
    <Form.Item label={label} name={name} className={span ? `form-select-span-${span}` : ""}>
      <Select defaultValue={defaultValue}>
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

