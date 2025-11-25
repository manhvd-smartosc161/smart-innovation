import React from "react";
import { Form, Input } from "antd";
import type { Rule } from "antd/es/form";
import "./index.scss";

interface FormFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "password" | "email";
  rules?: Rule[];
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  placeholder,
  type = "text",
  rules,
}) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      className="custom-form-field"
    >
      <Input type={type} placeholder={placeholder} />
    </Form.Item>
  );
};
