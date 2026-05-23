import { ModulePlaceholder } from './module-placeholder'
import { userManagementMeta } from './meta'

export default function UserManagement() {
  return <ModulePlaceholder meta={userManagementMeta} pageId="users" />
}
