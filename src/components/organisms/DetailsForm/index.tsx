import React from 'react';
import { Form, Input, Row, Col, Space, Button } from 'antd';
import { FormSelect, TagsContainer } from '@/components/molecules';
import './index.scss';

export const DetailsForm: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <div className="details-form-container">
      <div className="details-header">
        <h2 className="details-title">Details</h2>
        <Space>
          <Button className="ai-gen-btn" icon={<span>✨</span>}>
            AI Generation
          </Button>
          <Button className="save-btn" icon={<span>💾</span>}>
            Save
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" className="details-form">
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item label="Title" className="form-item-title">
              <Input
                defaultValue="Create order with invalid data"
                placeholder="Title"
                className="title-input"
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <FormSelect
              label="Type"
              defaultValue="Test Scenario"
              options={[
                { value: 'Test Scenario', label: 'Test Scenario' },
                { value: 'Test Case', label: 'Test Case' },
              ]}
            />
          </Col>
          <Col span={4}>
            <FormSelect
              label="Priority"
              defaultValue="Medium"
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={7}>
            <FormSelect
              label="System"
              defaultValue="Smart Open Solution Center"
              options={[
                {
                  value: 'Smart Open Solution Center',
                  label: 'Smart Open Solution Center',
                },
              ]}
            />
          </Col>
          <Col span={5}>
            <FormSelect
              label="Module"
              defaultValue="Smart Workspaces"
              options={[
                { value: 'Smart Workspaces', label: 'Smart Workspaces' },
              ]}
            />
          </Col>
          <Col span={4}>
            <FormSelect
              label="Feature"
              defaultValue="Test Composer"
              options={[{ value: 'Test Composer', label: 'Test Composer' }]}
            />
          </Col>
          <Col span={4}>
            <FormSelect
              label="Complexity"
              defaultValue="High"
              options={[
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' },
              ]}
            />
          </Col>
          <Col span={4}>
            <FormSelect
              label="Custom"
              defaultValue="No"
              options={[
                { value: 'No', label: 'No' },
                { value: 'Yes', label: 'Yes' },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <TagsContainer
              tags={[
                { label: 'Vietnam', color: 'green' },
                { label: 'USA', color: 'red' },
                { label: 'United Kingdom', color: 'blue' },
              ]}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
};
