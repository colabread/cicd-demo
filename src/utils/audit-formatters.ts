const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

export function formatAuditEventCount(count: number) {
  return COMPACT_NUMBER_FORMATTER.format(count)
}

export function formatAuditRate(rate: number) {
  return `${Math.round(rate * 100)}%`
}

export const AUDIT_EXPORT_COLUMNS = [
  'operator',
  'action',
  'resource',
  'ipAddress',
  'createdAt',
] as const

export function buildAuditCsvPreview(rows: readonly Record<string, string>[]) {
  return rows
    .map((row) => AUDIT_EXPORT_COLUMNS.map((column) => row[column] ?? '').join(','))
    .join('\n')
}
