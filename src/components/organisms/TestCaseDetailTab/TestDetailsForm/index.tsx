import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/atoms';
import { FormSelect, TiptapEditor } from '@/components/molecules';
import { useAnalysis } from '@/stores';
import { TAB_KEYS } from '@/constants';
import './index.scss';

interface TestDetailsFormProps {
  onAIGeneration?: () => void;
  isGenerating?: boolean;
  showSparkles?: boolean;
}

export const TestDetailsForm: React.FC<TestDetailsFormProps> = ({
  onAIGeneration,
  isGenerating = false,
  showSparkles = false,
}) => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const { selectedTestCaseId, markTabAsChanged, hasUnsavedChanges } =
    useAnalysis();
  const [hasChanges, setHasChanges] = useState(false);

  const handleFormChange = () => {
    // Mark tab as having unsaved changes when any field changes
    setHasChanges(true);
    markTabAsChanged(TAB_KEYS.TEST_CASE_DETAILS);
  };

  useEffect(() => {
    const testCaseId = searchParams.get('tc_id') || selectedTestCaseId;

    if (testCaseId) {
      // TODO: Call API to fetch test case details
      // For now, just set the ID
      form.setFieldsValue({ id: testCaseId });
    }
  }, [searchParams, selectedTestCaseId, form]);

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
          <div className="ai-gen-wrapper">
            {showSparkles && (
              <>
                <span className="sparkle sparkle-1">✨</span>
                <span className="sparkle sparkle-2">✨</span>
                <span className="sparkle sparkle-3">✨</span>
                <span className="sparkle sparkle-4">✨</span>
                <span className="sparkle sparkle-5">✨</span>
                <span className="sparkle sparkle-6">✨</span>
              </>
            )}
            <Button
              className={`ai-gen-btn ${isGenerating ? 'generating' : ''}`}
              icon={<span>✨</span>}
              onClick={onAIGeneration}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="generating-text">Generating...</span>
              ) : (
                'AI Generation'
              )}
            </Button>
          </div>
          <Button
            variant="primary"
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
        initialValues={{
          title: 'Create order with invalid data',
          type: 'Test Scenario',
          priority: 'Medium',
          complexity: 'High',
          custom: 'No',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Title" name="title" className="form-item-title">
              <Input
                placeholder="Title"
                className="title-input"
                onChange={handleFormChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="ID" name="id">
              <Input placeholder="ID" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <FormSelect
              label="Type"
              name="type"
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
