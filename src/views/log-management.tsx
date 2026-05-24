import { ModulePlaceholder } from './module-placeholder'
import { logManagementMeta } from './meta'
import { formatAuditEventCount } from '../utils/audit-formatters'

export default function LogManagement() {
  return (
    <ModulePlaceholder
      meta={{
        ...logManagementMeta,
        metrics: logManagementMeta.metrics.map((metric) =>
          metric.label === '今日事件'
            ? { ...metric, value: formatAuditEventCount(12808) }
            : metric,
        ),
      }}
      pageId="logs"
    />
  )
}
