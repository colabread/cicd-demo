import Button from 'antd/es/button'
import Card from 'antd/es/card'
import Space from 'antd/es/space'
import Table from 'antd/es/table'
import type { TableProps } from 'antd/es/table'
import Tag from 'antd/es/tag'
import Typography from 'antd/es/typography'

const { Paragraph, Text, Title } = Typography

export type ModuleMetric = {
  label: string
  value: string
  trend: string
}

export type ModulePageMeta = {
  title: string
  subtitle: string
  tone: string
  metrics: readonly ModuleMetric[]
  focus: readonly string[]
}

type PlaceholderRow = {
  key: string
  name: string
  owner: string
  status: string
  updatedAt: string
}

const PLACEHOLDER_ROWS: readonly PlaceholderRow[] = [
  {
    key: 'one',
    name: '七年级数学期中专项建设',
    owner: '教研中心',
    status: '进行中',
    updatedAt: '2026-05-23 09:30',
  },
  {
    key: 'two',
    name: '高一物理新课标资源校验',
    owner: '高中理综组',
    status: '待复核',
    updatedAt: '2026-05-22 18:12',
  },
  {
    key: 'three',
    name: '九年级语文阅读能力样卷',
    owner: '初中语文组',
    status: '已归档',
    updatedAt: '2026-05-21 14:48',
  },
]

const PLACEHOLDER_COLUMNS: TableProps<PlaceholderRow>['columns'] = [
  {
    title: '事项',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '负责团队',
    dataIndex: 'owner',
    key: 'owner',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <Tag color={status === '进行中' ? 'cyan' : 'gold'}>{status}</Tag>,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
]

export function ModulePlaceholder({ meta, pageId }: { meta: ModulePageMeta; pageId: string }) {
  return (
    <main className="page-shell">
      <section className="page-hero" aria-labelledby={`${pageId}-title`}>
        <div>
          <Space size={10} wrap>
            <Tag className="route-tone">{meta.tone}</Tag>
            <Text className="hero-kicker">教研 SaaS · 模块占位</Text>
          </Space>
          <Title id={`${pageId}-title`} level={1}>
            {meta.title}
          </Title>
          <Paragraph>{meta.subtitle}</Paragraph>
        </div>
        <Button type="primary" size="large">
          新建任务
        </Button>
      </section>

      <section className="metric-grid" aria-label={`${meta.title}核心指标`}>
        {meta.metrics.map((metric) => (
          <Card className="metric-card" key={metric.label}>
            <Text>{metric.label}</Text>
            <strong>{metric.value}</strong>
            <span>{metric.trend}</span>
          </Card>
        ))}
      </section>

      <section className="workbench-grid">
        <Card className="focus-card" title="本模块占位能力">
          <div className="focus-list">
            {meta.focus.map((item, index) => (
              <div className="focus-item" key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <Text>{item}</Text>
              </div>
            ))}
          </div>
        </Card>

        <Card className="table-card" title="近期教研事项">
          <Table
            columns={PLACEHOLDER_COLUMNS}
            dataSource={PLACEHOLDER_ROWS}
            pagination={false}
            size="middle"
          />
        </Card>
      </section>
    </main>
  )
}
