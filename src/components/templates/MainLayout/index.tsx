import React from 'react';
import { Layout } from 'antd';
import './index.scss';

const { Sider, Content, Header } = Layout;

interface MainLayoutProps {
  leftSidebar?: React.ReactNode;
  tabs?: React.ReactNode;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  leftSidebar,
  tabs,
  children,
}) => {
  return (
    <Layout className="main-layout">
      {tabs && <Header className="main-tabs-header">{tabs}</Header>}
      <Layout className="main-body">
        {leftSidebar && (
          <Sider width={280} theme="light" className="main-sider">
            {leftSidebar}
          </Sider>
        )}
        <Layout>
          <Content className="main-content">{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
