import AuditOutlined from '@ant-design/icons/AuditOutlined'
import BookOutlined from '@ant-design/icons/BookOutlined'
import ClusterOutlined from '@ant-design/icons/ClusterOutlined'
import DatabaseOutlined from '@ant-design/icons/DatabaseOutlined'
import EditOutlined from '@ant-design/icons/EditOutlined'
import FileTextOutlined from '@ant-design/icons/FileTextOutlined'
import SafetyCertificateOutlined from '@ant-design/icons/SafetyCertificateOutlined'
import TeamOutlined from '@ant-design/icons/TeamOutlined'
import type { ComponentType } from 'react'
import type { ModulePageMeta } from '../views/module-placeholder'
import KnowledgeGraph from '../views/knowledge-graph'
import LogManagement from '../views/log-management'
import PaperComposition from '../views/paper-composition'
import PaperManagement from '../views/paper-management'
import PermissionManagement from '../views/permission-management'
import QuestionBank from '../views/question-bank'
import QuestionLabeling from '../views/question-labeling'
import UserManagement from '../views/user-management'
import {
  knowledgeGraphMeta,
  logManagementMeta,
  paperCompositionMeta,
  paperManagementMeta,
  permissionManagementMeta,
  questionBankMeta,
  questionLabelingMeta,
  userManagementMeta,
} from '../views/meta'

export type ResearchRoute = {
  path: string
  meta: ModulePageMeta
  icon: ComponentType
  component: ComponentType
}

export const DEFAULT_ROUTE = '/question-bank'

export const researchRoutes = [
  {
    path: '/question-bank',
    meta: questionBankMeta,
    icon: DatabaseOutlined,
    component: QuestionBank,
  },
  {
    path: '/papers',
    meta: paperManagementMeta,
    icon: FileTextOutlined,
    component: PaperManagement,
  },
  {
    path: '/knowledge-graph',
    meta: knowledgeGraphMeta,
    icon: ClusterOutlined,
    component: KnowledgeGraph,
  },
  {
    path: '/users',
    meta: userManagementMeta,
    icon: TeamOutlined,
    component: UserManagement,
  },
  {
    path: '/permissions',
    meta: permissionManagementMeta,
    icon: SafetyCertificateOutlined,
    component: PermissionManagement,
  },
  {
    path: '/paper-composition',
    meta: paperCompositionMeta,
    icon: BookOutlined,
    component: PaperComposition,
  },
  {
    path: '/question-labeling',
    meta: questionLabelingMeta,
    icon: EditOutlined,
    component: QuestionLabeling,
  },
  {
    path: '/logs',
    meta: logManagementMeta,
    icon: AuditOutlined,
    component: LogManagement,
  },
] as const satisfies readonly ResearchRoute[]

export const routeByPath: ReadonlyMap<string, ResearchRoute> = new Map(
  researchRoutes.map((route) => [route.path, route]),
)

export function getSelectedPath(pathname: string) {
  return routeByPath.has(pathname) ? pathname : DEFAULT_ROUTE
}
