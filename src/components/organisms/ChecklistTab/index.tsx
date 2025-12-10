import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Input, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { MOCK_CHECKLIST_DATA } from '@/mock';
import './index.scss';

interface ChecklistItem {
  id: string;
  element: string;
  verification: string;
}

export const ChecklistTab: React.FC = () => {
  const [dataSource, setDataSource] =
    useState<ChecklistItem[]>(MOCK_CHECKLIST_DATA);
  const tableBodyRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  useEffect(() => {
    if (shouldScrollToBottom && tableBodyRef.current) {
      const tableBody = tableBodyRef.current.querySelector('.ant-table-body');
      if (tableBody) {
        tableBody.scrollTop = tableBody.scrollHeight;
      }
      // Use setTimeout to avoid cascading renders
      setTimeout(() => setShouldScrollToBottom(false), 0);
    }
  }, [dataSource, shouldScrollToBottom]);

  const handleAdd = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      element: '',
      verification: '',
    };
    setDataSource([...dataSource, newItem]);
    setShouldScrollToBottom(true);
  };

  const handleDelete = (id: string) => {
    setDataSource(dataSource.filter((item) => item.id !== id));
  };

  const handleChange = (
    id: string,
    field: keyof ChecklistItem,
    value: string
  ) => {
    setDataSource(
      dataSource.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = () => {
    // Filter out empty rows
    const validData = dataSource.filter(
      (item) => item.element || item.verification
    );

    if (validData.length === 0) {
      message.warning('Please add at least one row with data before saving.');
      return;
    }

    // TODO: Add API call to save data
    console.log('Checklist data to save:', validData);
    message.success('Checklist data has been saved successfully!');
  };

  const columns: ColumnsType<ChecklistItem> = [
    {
      title: 'Element',
      dataIndex: 'element',
      key: 'element',
      width: 300,
      render: (text: string, record: ChecklistItem) => (
        <Input
          value={text}
          onChange={(e) => handleChange(record.id, 'element', e.target.value)}
          placeholder="Enter element"
        />
      ),
    },
    {
      title: 'Verification',
      dataIndex: 'verification',
      key: 'verification',
      render: (text: string, record: ChecklistItem) => (
        <Input
          value={text}
          onChange={(e) =>
            handleChange(record.id, 'verification', e.target.value)
          }
          placeholder="Enter what needs to be verified"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: unknown, record: ChecklistItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <div className="checklist-tab">
      <div className="checklist-content" ref={tableBodyRef}>
        <div className="checklist-header">
          <h3>Checklist</h3>
          <div className="checklist-actions">
            <Button type="default" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Row
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={false}
          className="checklist-table"
          scroll={{ y: 400 }}
        />
      </div>
    </div>
  );
};
