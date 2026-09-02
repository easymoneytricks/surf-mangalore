import { useEffect, useMemo, useState } from 'react'

import {
  ActionToolbar,
  EmptyState,
  GenericDataTable,
  GenericListPage,
  Modal,
  Pagination,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  SelectInput,
  StatusBadge,
  TextInput,
} from '../../components/admin'
import { useToast } from '../../contexts/ui/ToastContext'
import { useAuth } from '../../contexts/AuthContext'
import { usersService, type AdminUserRecord, type AdminUsersListParams, type AdminUserRole, type AdminUserStatus } from '../../services/users.service'

const PAGE_SIZE = 8

function createUserFromName(name: string): string {
  return name
    .trim()
    .split(' ')
    .map((part) => part[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatRole(role: string) {
  return role
    .toLowerCase()
    .split('_')
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(' ')
}

function formatStatus(status: string) {
  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`
}

function formatLastLogin(value: string | null) {
  if (!value) {
    return 'Never'
  }

  return new Date(value).toLocaleString()
}

function isProtectedUser(user: AdminUserRecord) {
  return user.role === 'SUPER_ADMIN'
}

export default function UsersPage() {
  const { pushToast } = useToast()
  const { user: currentAdmin } = useAuth()
  const [users, setUsers] = useState<AdminUserRecord[]>([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewTarget, setViewTarget] = useState<AdminUserRecord | null>(null)
  const [editTarget, setEditTarget] = useState<AdminUserRecord | null>(null)
  const [saving, setSaving] = useState(false)
  const [provisioningOpen, setProvisioningOpen] = useState(false)
  const [resetPassword, setResetPassword] = useState('')
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState('')

  const query = useMemo<AdminUsersListParams>(() => ({
    page,
    pageSize: PAGE_SIZE,
    search: search.trim() || undefined,
    role: role === 'all' ? undefined : role as AdminUserRole,
    status: status === 'all' ? undefined : status,
  }), [page, role, search, status])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await usersService.list(query)
      setUsers(result.items)
      setTotalPages(result.pagination.totalPages)
      setTotalItems(result.pagination.totalItems)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [query])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const openView = async (id: number) => {
    try {
      const user = await usersService.getById(id)
      setViewTarget(user)
    } catch (loadError) {
      pushToast(loadError instanceof Error ? loadError.message : 'Failed to load user details', 'danger')
    }
  }

  const openEdit = async (id: number) => {
    try {
      const user = await usersService.getById(id)
      setEditTarget(user)
    } catch (loadError) {
      pushToast(loadError instanceof Error ? loadError.message : 'Failed to load user details', 'danger')
    }
  }

  const handleStatusToggle = async (target: AdminUserRecord) => {
    const nextStatus: AdminUserStatus = target.status === 'active' ? 'inactive' : 'active'

    try {
      await usersService.update(target.id, { status: nextStatus })
      await loadUsers()
      pushToast(`User ${nextStatus === 'active' ? 'activated' : 'deactivated'}`, 'info')

      if (viewTarget?.id === target.id) {
        setViewTarget({ ...viewTarget, status: nextStatus })
      }

      if (editTarget?.id === target.id) {
        setEditTarget({ ...editTarget, status: nextStatus })
      }
    } catch (updateError) {
      pushToast(updateError instanceof Error ? updateError.message : 'Failed to update user status', 'danger')
    }
  }

  const handleSaveEdit = async () => {
    if (!editTarget) {
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: editTarget.name,
        email: editTarget.email,
        role: editTarget.role,
        status: editTarget.status,
        avatar: editTarget.avatar,
      }

      await usersService.update(editTarget.id, payload)
      await loadUsers()
      setEditTarget(null)
      pushToast('User updated successfully', 'success')
    } catch (updateError) {
      pushToast(updateError instanceof Error ? updateError.message : 'Failed to update user', 'danger')
    } finally {
      setSaving(false)
    }
  }

  const handleResetPassword = async () => {
    if (!editTarget || currentAdmin?.role !== 'SUPER_ADMIN') return
    if (resetPassword.length < 8 || resetPassword !== resetPasswordConfirm) { pushToast(resetPassword.length < 8 ? 'Password must be at least 8 characters.' : 'Passwords do not match.', 'danger'); return }
    try { await usersService.changePassword(editTarget.id, { password: resetPassword, mustChangePassword: false }); setResetPassword(''); setResetPasswordConfirm(''); pushToast('Password updated successfully', 'success') } catch (error) { pushToast(error instanceof Error ? error.message : 'Unable to update password', 'danger') }
  }

  return (
    <GenericListPage
      title="Users"
      description="Manage admin users, roles, and account access."
      actions={(
        <div className="flex flex-wrap items-center gap-2">
          <SecondaryButton onClick={() => pushToast(`Export prepared for ${totalItems} users`, 'info')}>Export Users</SecondaryButton>
          <PrimaryButton onClick={() => setProvisioningOpen(true)}>Provisioning Notes</PrimaryButton>
        </div>
      )}
      filters={(
        <ActionToolbar>
          <SearchBar value={search} showLabel onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search name or email" />
          <SelectInput label="Role" value={role} onChange={(value) => { setRole(value); setPage(1) }} options={[{ label: 'All Roles', value: 'all' }, { label: 'Super Admin', value: 'SUPER_ADMIN' }, { label: 'Admin', value: 'ADMIN' }, { label: 'Editor', value: 'EDITOR' }, { label: 'Viewer', value: 'VIEWER' }]} />
          <SelectInput label="Status" value={status} onChange={(value) => { setStatus(value); setPage(1) }} options={[{ label: 'All Statuses', value: 'all' }, { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} />
        </ActionToolbar>
      )}
    >
      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/12 px-3 py-2 text-sm text-rose-200">{error}</p> : null}
      {loading ? <p className="text-sm text-(--color-text-secondary)">Loading users...</p> : null}
      {!loading && !users.length ? <EmptyState title="No users found" description="Try adjusting filters to find a matching admin account." /> : null}

      {!loading && users.length ? (
        <>
          <GenericDataTable<AdminUserRecord>
            rows={users}
            rowKey={(row) => String(row.id)}
            columns={[
              {
                key: 'user',
                header: 'User',
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-primary)/18 text-xs font-semibold text-(--color-primary)">
                      {createUserFromName(row.name)}
                    </div>
                    <div>
                      <p>{row.name}</p>
                      <p className="text-xs text-(--color-text-secondary)">{row.email}</p>
                    </div>
                  </div>
                ),
              },
              { key: 'role', header: 'Role', sortable: true, render: (row) => formatRole(row.role) },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <StatusBadge tone={row.status === 'active' ? 'positive' : 'warning'} label={formatStatus(row.status)} />,
              },
              { key: 'lastLogin', header: 'Last Login', sortable: true, render: (row) => formatLastLogin(row.lastLogin) },
            ]}
            rowActions={(row) => (
              <div className="flex flex-wrap gap-1">
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => void openView(row.id)}>View</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => void openEdit(row.id)} disabled={isProtectedUser(row)}>Edit</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => void handleStatusToggle(row)} disabled={isProtectedUser(row)}>
                  {row.status === 'active' ? 'Deactivate' : 'Activate'}
                </SecondaryButton>
              </div>
            )}
          />

          <div className="text-xs text-(--color-text-secondary)">Showing {users.length} users on page {page} of {totalPages} • total {totalItems}</div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : null}

      <Modal
        isOpen={Boolean(viewTarget)}
        title="User Details"
        onClose={() => setViewTarget(null)}
        footer={<div className="flex justify-end"><SecondaryButton onClick={() => setViewTarget(null)}>Close</SecondaryButton></div>}
      >
        {viewTarget ? (
          <div className="space-y-2 text-sm text-(--color-text-secondary)">
            <p><span className="font-medium text-(--color-text)">Name:</span> {viewTarget.name}</p>
            <p><span className="font-medium text-(--color-text)">Email:</span> {viewTarget.email}</p>
            <p><span className="font-medium text-(--color-text)">Role:</span> {formatRole(viewTarget.role)}</p>
            <p><span className="font-medium text-(--color-text)">Status:</span> {formatStatus(viewTarget.status)}</p>
            <p><span className="font-medium text-(--color-text)">Last Login:</span> {formatLastLogin(viewTarget.lastLogin)}</p>
            <p><span className="font-medium text-(--color-text)">Must Change Password:</span> {viewTarget.mustChangePassword ? 'Yes' : 'No'}</p>
          </div>
        ) : null}
      </Modal>
      <Modal isOpen={provisioningOpen} title="Provisioning Notes" onClose={() => setProvisioningOpen(false)} footer={<div className="flex justify-end"><SecondaryButton onClick={() => setProvisioningOpen(false)}>Close</SecondaryButton></div>}>
        <div className="space-y-3 text-sm leading-6 text-(--color-text-secondary)">
          <p>Admin users are provisioned through the existing development seed or approved direct database administration workflow.</p>
          <p>The seed is idempotent and preserves existing records. Production user changes should continue through the established backend administration process.</p>
          <p>No self-service provisioning flow is enabled in this panel.</p>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(editTarget)}
        title="Edit User"
        onClose={() => setEditTarget(null)}
        footer={(
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setEditTarget(null)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={() => void handleSaveEdit()} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</PrimaryButton>
          </div>
        )}
      >
        {editTarget ? (
          <div className="space-y-3">
            <TextInput label="Name" value={editTarget.name} onChange={(event) => setEditTarget({ ...editTarget, name: event.target.value })} />
            <TextInput label="Email" value={editTarget.email} onChange={(event) => setEditTarget({ ...editTarget, email: event.target.value })} />
            <SelectInput label="Role" value={editTarget.role} onChange={(value) => setEditTarget({ ...editTarget, role: value as AdminUserRole })} options={[{ label: 'Super Admin', value: 'SUPER_ADMIN' }, { label: 'Admin', value: 'ADMIN' }, { label: 'Editor', value: 'EDITOR' }, { label: 'Viewer', value: 'VIEWER' }]} disabled={isProtectedUser(editTarget)} />
            <SelectInput label="Status" value={editTarget.status} onChange={(value) => setEditTarget({ ...editTarget, status: value as AdminUserStatus })} options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} disabled={isProtectedUser(editTarget)} />
            <TextInput label="Avatar URL" value={editTarget.avatar || ''} onChange={(event) => setEditTarget({ ...editTarget, avatar: event.target.value || null })} />
            {currentAdmin?.role === 'SUPER_ADMIN' && editTarget.id !== currentAdmin.id ? (
              <div className="space-y-3 border-t border-white/10 pt-4"><p className="text-sm font-semibold text-(--color-text)">Security</p><TextInput label="Set New Password" type="password" value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} /><TextInput label="Confirm New Password" type="password" value={resetPasswordConfirm} onChange={(event) => setResetPasswordConfirm(event.target.value)} /><SecondaryButton onClick={() => void handleResetPassword()} disabled={!resetPassword || !resetPasswordConfirm}>Reset Password</SecondaryButton></div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </GenericListPage>
  )
}
