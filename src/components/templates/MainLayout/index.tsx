import React from "react";
import { Layout } from "antd";
import "./index.scss";

const { Sider, Content, Header } = Layout;

interface MainLayoutProps {
  sidebar: React.ReactNode;
  tabs?: React.ReactNode;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  sidebar,
  tabs,
  children,
}) => {
  return (
    <Layout className="main-layout">
      {tabs && <Header className="main-tabs-header">{tabs}</Header>}
      <Layout className="main-body">
        <Sider width={330} theme="light" className="main-sider">
          {sidebar}
        </Sider>
        <Layout>
          <Content className="main-content">{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
