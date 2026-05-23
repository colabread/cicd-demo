import Breadcrumb from 'antd/es/breadcrumb'
import Button from 'antd/es/button'
import ConfigProvider from 'antd/es/config-provider'
import Flex from 'antd/es/flex'
import Layout from 'antd/es/layout'
import Skeleton from 'antd/es/skeleton'
import Tag from 'antd/es/tag'
import Typography from 'antd/es/typography'
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

const NAV_ITEMS = researchRoutes.map((route) => {
  const Icon = route.icon

  return {
    Icon,
    label: route.meta.title,
    path: route.path,
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

  const handleNavClick = (path: string) => {
    navigate(path)
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
        <nav className="nav-menu" aria-label="教研模块导航">
          {NAV_ITEMS.map(({ Icon, label, path }) => (
            <button
              aria-current={selectedPath === path ? 'page' : undefined}
              className={`nav-item${selectedPath === path ? ' is-active' : ''}`}
              key={path}
              onClick={() => handleNavClick(path)}
              type="button"
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>
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
        },
      }}
    >
      <ResearchLayout />
    </ConfigProvider>
  )
}

export default App
