import AuditOutlined from '@ant-design/icons/AuditOutlined'
import BookOutlined from '@ant-design/icons/BookOutlined'
import ClusterOutlined from '@ant-design/icons/ClusterOutlined'
import DatabaseOutlined from '@ant-design/icons/DatabaseOutlined'
import EditOutlined from '@ant-design/icons/EditOutlined'
import FileTextOutlined from '@ant-design/icons/FileTextOutlined'
import SafetyCertificateOutlined from '@ant-design/icons/SafetyCertificateOutlined'
import TeamOutlined from '@ant-design/icons/TeamOutlined'
import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import type { ModulePageMeta } from '../views/module-placeholder'
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

const QuestionBank = lazy(() => import('../views/question-bank'))
const PaperManagement = lazy(() => import('../views/paper-management'))
const KnowledgeGraph = lazy(() => import('../views/knowledge-graph'))
const UserManagement = lazy(() => import('../views/user-management'))
const PermissionManagement = lazy(() => import('../views/permission-management'))
const PaperComposition = lazy(() => import('../views/paper-composition'))
const QuestionLabeling = lazy(() => import('../views/question-labeling'))
const LogManagement = lazy(() => import('../views/log-management'))

export type ResearchRoute = {
  path: string
  meta: ModulePageMeta
  icon: ComponentType
  component: LazyExoticComponent<ComponentType>
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
