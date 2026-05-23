import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import AuditIcon from '../assets/icons/audit.svg?react'
import BookIcon from '../assets/icons/book.svg?react'
import DatabaseIcon from '../assets/icons/database.svg?react'
import EditIcon from '../assets/icons/edit.svg?react'
import FileTextIcon from '../assets/icons/file-text.svg?react'
import GraphIcon from '../assets/icons/graph.svg?react'
import ShieldIcon from '../assets/icons/shield.svg?react'
import UsersIcon from '../assets/icons/users.svg?react'
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
    icon: DatabaseIcon,
    component: QuestionBank,
  },
  {
    path: '/papers',
    meta: paperManagementMeta,
    icon: FileTextIcon,
    component: PaperManagement,
  },
  {
    path: '/knowledge-graph',
    meta: knowledgeGraphMeta,
    icon: GraphIcon,
    component: KnowledgeGraph,
  },
  {
    path: '/users',
    meta: userManagementMeta,
    icon: UsersIcon,
    component: UserManagement,
  },
  {
    path: '/permissions',
    meta: permissionManagementMeta,
    icon: ShieldIcon,
    component: PermissionManagement,
  },
  {
    path: '/paper-composition',
    meta: paperCompositionMeta,
    icon: BookIcon,
    component: PaperComposition,
  },
  {
    path: '/question-labeling',
    meta: questionLabelingMeta,
    icon: EditIcon,
    component: QuestionLabeling,
  },
  {
    path: '/logs',
    meta: logManagementMeta,
    icon: AuditIcon,
    component: LogManagement,
  },
] as const satisfies readonly ResearchRoute[]

export const routeByPath: ReadonlyMap<string, ResearchRoute> = new Map(
  researchRoutes.map((route) => [route.path, route]),
)

export function getSelectedPath(pathname: string) {
  return routeByPath.has(pathname) ? pathname : DEFAULT_ROUTE
}
