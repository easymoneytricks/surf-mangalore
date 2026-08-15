import { useEffect, useMemo, useState } from 'react'

import {
  ActionToolbar,
  DeleteConfirmationDialog,
  EmptyState,
  GenericDataTable,
  GenericListPage,
  LoadingState,
  Modal,
  Pagination,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  SelectInput,
  StatusBadge,
  TextInput,
  TextareaInput,
} from '../../components/admin'
import { useToast } from '../../contexts/ui/ToastContext'
import { permissionsService } from '../../services/permissions.service'
import { rolesService } from '../../services/roles.service'
import { type AdminPermissionGroup, type AdminPermissionSummary } from '../../types/permissions'
import { type AdminRoleMutationInput, type AdminRolePermissionSummary, type AdminRoleRecord, type AdminRolesListParams } from '../../types/roles'

type RoleFormState = Partial<AdminRoleRecord> & {
  permissionIds?: number[]
  isNew?: boolean
}

const PAGE_SIZE = 8

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

function formatStatus(status: string) {
  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`
}

function formatRoleType(isSystem: boolean) {
  return isSystem ? 'System' : 'Custom'
}

function groupToPermissionIds(groups: AdminPermissionGroup[]) {
  return groups.flatMap((group) => group.permissions.map((permission) => permission.id))
}

function permissionLabel(permission: Pick<AdminPermissionSummary, 'resource' | 'action'> | Pick<AdminRolePermissionSummary, 'resource' | 'action'>) {
  return `${permission.resource}.${permission.action}`
}

export default function RolesPage() {
  const { pushToast } = useToast()
  const [roles, setRoles] = useState<AdminRoleRecord[]>([])
  const [permissionGroups, setPermissionGroups] = useState<AdminPermissionGroup[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<RoleFormState | null>(null)
  const [viewTarget, setViewTarget] = useState<AdminRoleRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminRoleRecord | null>(null)

  const query = useMemo<AdminRolesListParams>(() => ({
    page,
    pageSize: PAGE_SIZE,
    search: search.trim() || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  }), [page, search, statusFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [rolesResult, permissionsResult] = await Promise.all([
        rolesService.list(query),
        permissionsService.list({ page: 1, pageSize: 100 }),
      ])

      setRoles(rolesResult.items)
      setTotalPages(rolesResult.pagination.totalPages)
      setTotalItems(rolesResult.pagination.totalItems)
      setPermissionGroups(permissionsResult.grouped)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load roles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [query])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const openCreate = () => {
    setEditTarget({
      name: '',
      title: '',
      description: '',
      status: 'active',
      isSystem: false,
      permissionIds: [],
      isNew: true,
    })
  }

  const openEdit = (role: AdminRoleRecord) => {
    setEditTarget({
      ...role,
      permissionIds: role.permissions.map((permission) => permission.id),
      isNew: false,
    })
  }

  const togglePermission = (permissionId: number) => {
    if (!editTarget) {
      return
    }

    const next = new Set(editTarget.permissionIds ?? [])
    if (next.has(permissionId)) {
      next.delete(permissionId)
    } else {
      next.add(permissionId)
    }

    setEditTarget({ ...editTarget, permissionIds: [...next] })
  }

  const handleSave = async () => {
    if (!editTarget) {
      return
    }

    setSaving(true)
    try {
      const payload: AdminRoleMutationInput = {
        name: editTarget.name ?? '',
        title: editTarget.title ?? '',
        description: editTarget.description ?? '',
        status: editTarget.status,
        isSystem: Boolean(editTarget.isSystem),
        permissionIds: editTarget.permissionIds ?? [],
      }

      if (editTarget.id) {
        await rolesService.update(editTarget.id, payload)
        pushToast('Role updated successfully', 'success')
      } else {
        await rolesService.create(payload)
        pushToast('Role created successfully', 'success')
      }

      setEditTarget(null)
      void loadData()
    } catch (saveError) {
      pushToast(saveError instanceof Error ? saveError.message : 'Failed to save role', 'danger')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await rolesService.remove(deleteTarget.id)
      pushToast('Role deleted successfully', 'success')
      setDeleteTarget(null)
      void loadData()
    } catch (deleteError) {
      pushToast(deleteError instanceof Error ? deleteError.message : 'Failed to delete role', 'danger')
    }
  }

  return (
    <GenericListPage
      title="Roles"
      description="Configure role definitions, assign permissions, and keep system roles protected."
      actions={(
        <div className="flex flex-wrap items-center gap-2">
          <SecondaryButton onClick={() => void loadData()}>Refresh</SecondaryButton>
          <PrimaryButton onClick={openCreate}>Create Role</PrimaryButton>
        </div>
      )}
      filters={(
        <ActionToolbar>
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search role name, title, or slug" />
          <SelectInput label="Status" value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1) }} options={STATUS_OPTIONS} />
        </ActionToolbar>
      )}
    >
      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/12 px-3 py-2 text-sm text-rose-200">{error}</p> : null}
      {loading ? <LoadingState mode="table" /> : null}
      {!loading && !roles.length ? <EmptyState title="No roles found" description="Create a role to start assigning permissions." /> : null}

      {!loading && roles.length ? (
        <>
          <GenericDataTable<AdminRoleRecord>
            rows={roles}
            rowKey={(row) => String(row.id)}
            columns={[
              { key: 'name', header: 'Role', sortable: true, render: (row) => row.title },
              { key: 'slug', header: 'Slug', render: (row) => row.slug },
              { key: 'users', header: 'Users', sortable: true, render: (row) => row.userCount },
              { key: 'permissions', header: 'Permissions', sortable: true, render: (row) => row.permissionCount },
              { key: 'type', header: 'Type', render: (row) => <StatusBadge tone={row.isSystem ? 'info' : 'neutral'} label={formatRoleType(row.isSystem)} /> },
              { key: 'status', header: 'Status', render: (row) => <StatusBadge tone={row.status === 'active' ? 'positive' : 'warning'} label={formatStatus(row.status)} /> },
            ]}
            rowActions={(row) => (
              <div className="flex flex-wrap gap-1">
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setViewTarget(row)}>View</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => openEdit(row)}>Edit</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setDeleteTarget(row)} disabled={row.isSystem || row.userCount > 0}>Delete</SecondaryButton>
              </div>
            )}
          />

          <div className="text-xs text-(--color-text-secondary)">Showing {roles.length} roles on page {page} of {totalPages} • total {totalItems}</div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : null}

      <Modal
        isOpen={Boolean(viewTarget)}
        title="Role Details"
        onClose={() => setViewTarget(null)}
        footer={<div className="flex justify-end"><SecondaryButton onClick={() => setViewTarget(null)}>Close</SecondaryButton></div>}
      >
        {viewTarget ? (
          <div className="space-y-3">
            <p className="text-sm text-(--color-text-secondary)">{viewTarget.description || 'No description provided.'}</p>
            <div className="grid gap-2 text-sm text-(--color-text-secondary)">
              <p><span className="font-medium text-(--color-text)">Slug:</span> {viewTarget.slug}</p>
              <p><span className="font-medium text-(--color-text)">Users:</span> {viewTarget.userCount}</p>
              <p><span className="font-medium text-(--color-text)">Permissions:</span> {viewTarget.permissionCount}</p>
              <p><span className="font-medium text-(--color-text)">Type:</span> {formatRoleType(viewTarget.isSystem)}</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.16em] text-(--color-text-secondary)">Assigned permissions</p>
              <div className="flex flex-wrap gap-2">
                {viewTarget.permissions.map((permission) => (
                  <span key={permission.id} className="rounded-full border border-white/15 px-3 py-1 text-xs text-(--color-text)">
                    {permissionLabel(permission)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={Boolean(editTarget)}
        title={editTarget?.id ? 'Edit Role' : 'Create Role'}
        onClose={() => setEditTarget(null)}
        footer={(
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setEditTarget(null)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={() => void handleSave()} disabled={saving}>{saving ? 'Saving...' : 'Save Role'}</PrimaryButton>
          </div>
        )}
      >
        {editTarget ? (
          <div className="space-y-4">
            <TextInput label="Role Name" value={editTarget.name || ''} onChange={(event) => setEditTarget({ ...editTarget, name: event.target.value })} />
            <TextInput label="Display Title" value={editTarget.title || ''} onChange={(event) => setEditTarget({ ...editTarget, title: event.target.value })} />
            <TextareaInput label="Description" value={editTarget.description || ''} onChange={(event) => setEditTarget({ ...editTarget, description: event.target.value })} />
            <SelectInput label="Status" value={editTarget.status || 'active'} onChange={(value) => setEditTarget({ ...editTarget, status: value })} options={STATUS_OPTIONS.filter((option) => option.value !== 'all')} />
            <label className="flex items-center gap-2 text-sm text-(--color-text-secondary)">
              <input type="checkbox" checked={Boolean(editTarget.isSystem)} onChange={(event) => setEditTarget({ ...editTarget, isSystem: event.target.checked })} />
              System role
            </label>

            <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-(--color-text)">Permission matrix</p>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setEditTarget({ ...editTarget, permissionIds: groupToPermissionIds(permissionGroups) })}>Select all</SecondaryButton>
              </div>
              <div className="space-y-4">
                {permissionGroups.map((group) => (
                  <section key={group.resource} className="rounded-xl border border-white/10 bg-black/10 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-(--color-text)">{group.title}</h4>
                      <span className="text-xs text-(--color-text-secondary)">{group.permissions.length} permissions</span>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {group.permissions.map((permission) => {
                        const checked = Boolean(editTarget.permissionIds?.includes(permission.id))
                        return (
                          <label key={permission.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-(--color-text)">
                            <span>
                              <span className="block font-medium">{permission.title}</span>
                              <span className="block text-xs text-(--color-text-secondary)">{permission.slug}</span>
                            </span>
                            <input type="checkbox" checked={checked} onChange={() => togglePermission(permission.id)} />
                          </label>
                        )
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        resourceName={deleteTarget?.title || 'role'}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </GenericListPage>
  )
}
