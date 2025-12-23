import React from 'react';
import { Form, Input, Row, Col, Space, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { FormSelect, TiptapEditor } from '@/components/molecules';
import { useAnalysis } from '@/contexts';
import './index.scss';

export const DetailsForm: React.FC = () => {
  const [form] = Form.useForm();
  const { selectedTestCaseId } = useAnalysis();

  return (
    <div className="details-form-container">
      <div className="details-header">
        <h2 className="details-title">Details</h2>
        <Space>
          <Button className="ai-gen-btn" icon={<span>✨</span>}>
            AI Generation
          </Button>
          <Button type="primary" className="save-btn" icon={<SaveOutlined />}>
            Save
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" className="details-form">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Title" className="form-item-title">
              <Input
                defaultValue="Create order with invalid data"
                placeholder="Title"
                className="title-input"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="ID">
              <Input
                value={selectedTestCaseId || 'TS-0000001'}
                placeholder="ID"
                disabled
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <FormSelect
              label="Type"
              defaultValue="Test Scenario"
              options={[
                { value: 'Test Scenario', label: 'Test Scenario' },
                { value: 'Test Case', label: 'Test Case' },
              ]}
            />
          </Col>
          <Col span={6}>
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
          <Col span={6}>
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
          <Col span={6}>
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
          <Col span={24}>
            <Form.Item label="Pre Condition">
              <TiptapEditor
                value="<p>1. User is logged in.</p><p>2. Product is in stock.</p><p>3. Payment gateway is configured.</p>"
                onChange={(html) => console.log('Pre condition changed:', html)}
                placeholder="Enter pre-conditions"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
