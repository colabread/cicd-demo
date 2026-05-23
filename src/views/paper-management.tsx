import { startCase } from 'lodash'

import { ModulePlaceholder } from './module-placeholder'
import { paperManagementMeta } from './meta'

export default function PaperManagement() {
  const vendorChunkLabel = startCase('paper management')

  return (
    <ModulePlaceholder
      meta={{
        ...paperManagementMeta,
        subtitle: `${paperManagementMeta.subtitle} · ${vendorChunkLabel}`,
      }}
      pageId="papers"
    />
  )
}
