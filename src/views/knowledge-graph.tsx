import { ModulePlaceholder } from './module-placeholder'
import { knowledgeGraphMeta } from './meta'

export default function KnowledgeGraph() {
  return <ModulePlaceholder meta={knowledgeGraphMeta} pageId="knowledge-graph" />
}
