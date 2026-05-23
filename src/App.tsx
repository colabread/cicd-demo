import {
  Breadcrumb,
  Button,
  ConfigProvider,
  Flex,
  Layout,
  Menu,
  Skeleton,
  Tag,
  Typography,
} from 'antd'
import type { MenuProps } from 'antd'
import { Suspense, createElement } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  DEFAULT_ROUTE,
  getSelectedPath,
  researchRoutes,
  routeByPath,
} from './router'
import './App.css'

const { Header, Sider, Content } = Layout
const { Text, Title } = Typography

const MENU_ITEMS: MenuProps['items'] = researchRoutes.map((route) => {
  const Icon = route.icon

  return {
    key: route.path,
    icon: <Icon />,
    label: route.meta.title,
  }
})

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-label="页面加载中">
      <div className="route-fallback-header">
        <Skeleton.Button active block size="small" />
        <Skeleton.Button active block />
      </div>
      <div className="route-fallback-grid">
        <Skeleton active paragraph={{ rows: 2 }} title />
        <Skeleton active paragraph={{ rows: 2 }} title />
        <Skeleton active paragraph={{ rows: 2 }} title />
      </div>
      <Skeleton active paragraph={{ rows: 6 }} title />
    </div>
  )
}

function ResearchLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedPath = getSelectedPath(location.pathname)
  const selectedRoute = routeByPath.get(selectedPath)

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  return (
    <Layout className="saas-shell">
      <Sider className="sidebar" width={252} breakpoint="lg" collapsedWidth={0}>
        <div className="brand-block">
          <div className="brand-mark">研</div>
          <div>
            <Text className="brand-eyebrow">Edu Research Cloud</Text>
            <Title level={2}>校本教研平台</Title>
          </div>
        </div>
        <Menu
          className="nav-menu"
          items={MENU_ITEMS}
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[selectedPath]}
        />
      </Sider>

      <Layout className="workspace-layout">
        <Header className="topbar">
          <div>
            <Breadcrumb
              items={[
                { title: '教研工作台' },
                { title: selectedRoute?.meta.title ?? '模块' },
              ]}
            />
            <Text>面向学校教研人员的资源、命题、标注与审计协同中枢</Text>
          </div>
          <Flex gap={12} align="center">
            <Tag color="green">区校同步正常</Tag>
            <Button>导出简报</Button>
          </Flex>
        </Header>

        <Content className="workspace-content">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to={DEFAULT_ROUTE} replace />} />
              {researchRoutes.map((route) => (
                <Route
                  element={createElement(route.component)}
                  key={route.path}
                  path={route.path.slice(1)}
                />
              ))}
              <Route path="*" element={<Navigate to={DEFAULT_ROUTE} replace />} />
            </Routes>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  )
}

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 6,
          colorBgBase: '#f7f5ee',
          colorPrimary: '#0f766e',
          colorTextBase: '#23221f',
          fontFamily:
            'Avenir Next, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif',
        },
        components: {
          Button: {
            controlHeightLG: 44,
          },
          Layout: {
            bodyBg: '#f7f5ee',
            headerBg: 'rgba(247, 245, 238, 0.88)',
            siderBg: '#143c35',
          },
          Menu: {
            itemBg: 'transparent',
            itemBorderRadius: 6,
            itemColor: 'rgba(255, 255, 255, 0.76)',
            itemHoverBg: 'rgba(255, 255, 255, 0.09)',
            itemHoverColor: '#ffffff',
            itemSelectedBg: '#f0c86a',
            itemSelectedColor: '#1f271f',
          },
        },
      }}
    >
      <ResearchLayout />
    </ConfigProvider>
  )
}

export default App
