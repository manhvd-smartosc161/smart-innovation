import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Input, Select, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { SYSTEMS, COMPONENTS, ELEMENTS_BY_COMPONENT } from '@/mock';
import { MOCK_IMPACT_DATA } from '@/mock';
import './index.scss';

interface ImpactItem {
  id: string;
  system: string;
  component: string;
  element: string;
  description: string;
}

export const ImpactTab: React.FC = () => {
  const [dataSource, setDataSource] = useState<ImpactItem[]>(MOCK_IMPACT_DATA);
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
    const newItem: ImpactItem = {
      id: Date.now().toString(),
      system: '',
      component: '',
      element: '',
      description: '',
    };
    setDataSource([...dataSource, newItem]);
    setShouldScrollToBottom(true);
  };

  const handleDelete = (id: string) => {
    setDataSource(dataSource.filter((item) => item.id !== id));
  };

  const handleChange = (id: string, field: keyof ImpactItem, value: string) => {
    setDataSource((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleComponentChange = (id: string, value: string) => {
    setDataSource((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, component: value, element: '' } : item
      )
    );
  };

  const handleSave = () => {
    // Filter out empty rows
    const validData = dataSource.filter(
      (item) =>
        item.system || item.component || item.element || item.description
    );

    if (validData.length === 0) {
      message.warning('Please add at least one row with data before saving.');
      return;
    }

    // TODO: Add API call to save data
    console.log('Impact data to save:', validData);
    message.success('Impact data has been saved successfully!');
  };

  const columns: ColumnsType<ImpactItem> = [
    {
      title: 'System',
      dataIndex: 'system',
      key: 'system',
      width: 200,
      render: (text: string, record: ImpactItem) => (
        <Select
          value={text || undefined}
          onChange={(value) => handleChange(record.id, 'system', value)}
          placeholder="Select system"
          style={{ width: '100%' }}
          options={SYSTEMS}
        />
      ),
    },
    {
      title: 'Component',
      dataIndex: 'component',
      key: 'component',
      width: 200,
      render: (text: string, record: ImpactItem) => (
        <Select
          value={text || undefined}
          onChange={(value) => handleComponentChange(record.id, value || '')}
          placeholder="Select component"
          style={{ width: '100%' }}
          options={COMPONENTS}
        />
      ),
    },
    {
      title: 'Element',
      dataIndex: 'element',
      key: 'element',
      width: 200,
      render: (text: string, record: ImpactItem) => {
        const componentValue = record.component;
        const hasComponent = Boolean(componentValue && componentValue.trim());
        const elements = hasComponent
          ? ELEMENTS_BY_COMPONENT[componentValue] || []
          : [];

        return (
          <Select
            value={text || undefined}
            onChange={(value) =>
              handleChange(record.id, 'element', value || '')
            }
            placeholder="Select element"
            style={{ width: '100%' }}
            options={elements}
            disabled={!hasComponent}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: ImpactItem) => (
        <Input
          value={text}
          onChange={(e) =>
            handleChange(record.id, 'description', e.target.value)
          }
          placeholder="Enter description"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: unknown, record: ImpactItem) => (
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
    <div className="impact-tab">
      <div className="impact-content" ref={tableBodyRef}>
        <div className="impact-header">
          <h3>Impact</h3>
          <div className="impact-actions">
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
          className="impact-table"
          key={dataSource.length}
          scroll={{ x: 'max-content', y: 400 }}
        />
      </div>
    </div>
  );
};
