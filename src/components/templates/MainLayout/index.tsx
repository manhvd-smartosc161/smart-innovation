import React, { useState } from 'react';
import { Layout, Drawer, Button, Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './index.scss';

const { Sider, Content, Header } = Layout;
const { useBreakpoint } = Grid;

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
  const screens = useBreakpoint();
  // If screens are not yet determined (during first render), assume desktop to avoid flash or layout shift if possible,
  // but better to sync with CSS. 'md' is usually 768px.
  // We'll consider 'md' and up as desktop.
  const isMobile = !screens.md;
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <Layout className="main-layout">
      <Header className="main-tabs-header">
        {isMobile && leftSidebar && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            className="mobile-menu-btn"
          />
        )}
        {tabs}
      </Header>

      <Layout className="main-body">
        {!isMobile && leftSidebar && (
          <Sider width={250} theme="light" className="main-sider">
            {leftSidebar}
          </Sider>
        )}

        {isMobile && leftSidebar && (
          <Drawer
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            className="mobile-sidebar-drawer"
            styles={{ body: { padding: 0 } }}
          >
            {leftSidebar}
          </Drawer>
        )}

        <Layout>
          <Content className="main-content">{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
