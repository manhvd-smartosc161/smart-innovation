import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Space, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { FormSelect, TiptapEditor } from '@/components/molecules';
import { useAnalysis } from '@/contexts';
import { TAB_KEYS } from '@/constants';
import './index.scss';

export const DetailsForm: React.FC = () => {
  const [form] = Form.useForm();
  const { selectedTestCaseId, markTabAsChanged, hasUnsavedChanges } =
    useAnalysis();
  const [hasChanges, setHasChanges] = useState(false);

  const handleFormChange = () => {
    // Mark tab as having unsaved changes when any field changes
    setHasChanges(true);
    markTabAsChanged(TAB_KEYS.TEST_CASE_DETAILS);
  };

  // Sync hasChanges with unsaved changes from steps
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges(TAB_KEYS.TEST_CASE_DETAILS) && !hasChanges) {
        setHasChanges(true);
      }
    }, 100); // Check every 100ms
    return () => clearInterval(interval);
  }, [hasUnsavedChanges, hasChanges]);

  return (
    <div className="details-form-container">
      <div className="details-header">
        <h2 className="details-title">Details</h2>
        <Space>
          <Button className="ai-gen-btn" icon={<span>✨</span>}>
            AI Generation
          </Button>
          <Button
            type="primary"
            className="save-btn"
            icon={<SaveOutlined />}
            disabled={!hasChanges}
          >
            Save
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        className="details-form"
        onValuesChange={handleFormChange}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Title" name="title" className="form-item-title">
              <Input
                defaultValue="Create order with invalid data"
                placeholder="Title"
                className="title-input"
                onChange={handleFormChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="ID" name="id">
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
              name="type"
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
              name="priority"
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
              name="complexity"
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
              name="custom"
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
            <Form.Item label="Pre Condition" name="preCondition">
              <TiptapEditor
                value="<p>1. User is logged in.</p><p>2. Product is in stock.</p><p>3. Payment gateway is configured.</p>"
                onChange={(html) => {
                  console.log('Pre condition changed:', html);
                  handleFormChange();
                }}
                placeholder="Enter pre-conditions"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
