import { useEffect, useMemo, useState } from 'react'

import {
  ActionToolbar,
  EmptyState,
  GenericDataTable,
  GenericListPage,
  LoadingState,
  Pagination,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  SelectInput,
  StatusBadge,
} from '../../components/admin'
import { useToast } from '../../contexts/ui/ToastContext'
import { permissionsService } from '../../services/permissions.service'
import { rolesService } from '../../services/roles.service'
import { type AdminPermissionGroup, type AdminPermissionSummary } from '../../types/permissions'
import { type AdminRoleRecord } from '../../types/roles'

const PAGE_SIZE = 8

function labelPermission(permission: AdminPermissionSummary) {
  return `${permission.resource}.${permission.action}`
}

function formatRoleType(isSystem: boolean) {
  return isSystem ? 'System' : 'Custom'
}

export default function PermissionsPage() {
  const { pushToast } = useToast()
  const [groups, setGroups] = useState<AdminPermissionGroup[]>([])
  const [roles, setRoles] = useState<AdminRoleRecord[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [resourceFilter, setResourceFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [permissionsResult, rolesResult] = await Promise.all([
        permissionsService.list({ page: 1, pageSize: 100 }),
        rolesService.list({ page: 1, pageSize: 100 }),
      ])

      setGroups(permissionsResult.grouped)
      setRoles(rolesResult.items)
      setTotalPages(permissionsResult.pagination.totalPages)
      setTotalItems(permissionsResult.pagination.totalItems)

      const nextRole = rolesResult.items.find((role) => role.id === selectedRoleId) ?? rolesResult.items[0] ?? null
      if (nextRole) {
        setSelectedRoleId(nextRole.id)
        setCheckedIds(nextRole.permissions.map((permission) => permission.id))
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load permissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  useEffect(() => {
    const currentRole = roles.find((role) => role.id === selectedRoleId)
    if (currentRole) {
      setCheckedIds(currentRole.permissions.map((permission) => permission.id))
    }
  }, [roles, selectedRoleId])

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase()
    return groups
      .filter((group) => resourceFilter === 'all' || group.resource === resourceFilter)
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter((permission) => {
          if (!query) {
            return true
          }

          return `${permission.title} ${permission.slug} ${permission.resource} ${permission.action}`.toLowerCase().includes(query)
        }),
      }))
      .filter((group) => group.permissions.length > 0)
  }, [groups, resourceFilter, search])

  const togglePermission = (permissionId: number) => {
    setCheckedIds((previous) => (previous.includes(permissionId) ? previous.filter((item) => item !== permissionId) : [...previous, permissionId]))
  }

  const handleSave = async () => {
    if (!selectedRoleId) {
      return
    }

    setSaving(true)
    try {
      await rolesService.updatePermissions(selectedRoleId, { permissionIds: checkedIds })
      pushToast('Role permissions saved successfully', 'success')
      void loadData()
    } catch (saveError) {
      pushToast(saveError instanceof Error ? saveError.message : 'Failed to save permissions', 'danger')
    } finally {
      setSaving(false)
    }
  }

  const selectedRole = roles.find((role) => role.id === selectedRoleId) || null
  const pageRows = filteredGroups.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <GenericListPage
      title="Permissions"
      description="Review grouped permissions and assign them to roles using the live database matrix."
      actions={(
        <div className="flex flex-wrap items-center gap-2">
          <SecondaryButton onClick={() => void loadData()}>Refresh</SecondaryButton>
          <PrimaryButton onClick={() => void handleSave()} disabled={saving || !selectedRoleId}>{saving ? 'Saving...' : 'Save Changes'}</PrimaryButton>
        </div>
      )}
      filters={(
        <ActionToolbar>
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search permission, resource, or slug" />
          <SelectInput
            label="Resource"
            value={resourceFilter}
            onChange={(value) => { setResourceFilter(value); setPage(1) }}
            options={[
              { label: 'All Resources', value: 'all' },
              ...groups.map((group) => ({ label: group.title, value: group.resource })),
            ]}
          />
          <SelectInput
            label="Role"
            value={selectedRoleId ? String(selectedRoleId) : ''}
            onChange={(value) => {
              const nextRole = roles.find((role) => String(role.id) === value)
              if (nextRole) {
                setSelectedRoleId(nextRole.id)
                setCheckedIds(nextRole.permissions.map((permission) => permission.id))
              }
            }}
            options={roles.map((role) => ({ label: `${role.title} (${formatRoleType(role.isSystem)})`, value: String(role.id) }))}
          />
        </ActionToolbar>
      )}
    >
      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/12 px-3 py-2 text-sm text-rose-200">{error}</p> : null}
      {loading ? <LoadingState mode="table" /> : null}
      {!loading && !filteredGroups.length ? <EmptyState title="No permissions found" description="Try adjusting filters or seed the access-control catalog." /> : null}

      {!loading && filteredGroups.length ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              {pageRows.map((group) => (
                <section key={group.resource} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-(--color-text-secondary)">{group.title}</h3>
                      <p className="text-xs text-(--color-text-secondary)">{group.permissions.length} permissions</p>
                    </div>
                    <StatusBadge tone="info" label={group.resource} />
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {group.permissions.map((permission) => {
                      const checked = checkedIds.includes(permission.id)
                      return (
                        <label key={permission.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm text-(--color-text)">
                          <span>
                            <span className="block font-medium">{permission.title}</span>
                            <span className="block text-xs text-(--color-text-secondary)">{labelPermission(permission)}</span>
                          </span>
                          <input type="checkbox" checked={checked} onChange={() => togglePermission(permission.id)} />
                        </label>
                      )
                    })}
                  </div>
                </section>
              ))}
              <div className="text-xs text-(--color-text-secondary)">Showing {pageRows.length} grouped resources on page {page} of {totalPages} • total {totalItems} permissions</div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            <aside className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-(--color-text-secondary)">Selected role</h3>
                <p className="mt-2 text-lg font-medium text-(--color-text)">{selectedRole?.title || 'No role selected'}</p>
                <p className="text-sm text-(--color-text-secondary)">{selectedRole?.description || 'Choose a role to edit its permissions.'}</p>
              </div>

              {selectedRole ? (
                <>
                  <div className="grid gap-2 text-sm text-(--color-text-secondary)">
                    <p><span className="font-medium text-(--color-text)">Slug:</span> {selectedRole.slug}</p>
                    <p><span className="font-medium text-(--color-text)">Type:</span> {formatRoleType(selectedRole.isSystem)}</p>
                    <p><span className="font-medium text-(--color-text)">Permissions:</span> {checkedIds.length}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                    <p className="mb-2 text-xs uppercase tracking-[0.14em] text-(--color-text-secondary)">Active permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {checkedIds.slice(0, 24).map((permissionId) => {
                        const permission = groups.flatMap((group) => group.permissions).find((item) => item.id === permissionId)
                        if (!permission) {
                          return null
                        }

                        return (
                          <span key={permission.id} className="rounded-full border border-white/15 px-2 py-1 text-[11px] text-(--color-text)">
                            {labelPermission(permission)}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setCheckedIds([])}>Clear all</SecondaryButton>
                    <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setCheckedIds(groups.flatMap((group) => group.permissions.map((permission) => permission.id)))}>Select all</SecondaryButton>
                  </div>
                </>
              ) : null}
            </aside>
          </div>

          <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-(--color-text-secondary)">Role assignment preview</h3>
            <GenericDataTable<AdminRoleRecord>
              rows={roles}
              rowKey={(row) => String(row.id)}
              columns={[
                { key: 'role', header: 'Role', render: (row) => row.title },
                { key: 'users', header: 'Users', render: (row) => row.userCount },
                { key: 'permissions', header: 'Permissions', render: (row) => row.permissionCount },
                { key: 'type', header: 'Type', render: (row) => <StatusBadge tone={row.isSystem ? 'info' : 'neutral'} label={formatRoleType(row.isSystem)} /> },
              ]}
              rowActions={(row) => (
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => {
                  setSelectedRoleId(row.id)
                  setCheckedIds(row.permissions.map((permission) => permission.id))
                }}>
                  Open Role
                </SecondaryButton>
              )}
            />
          </section>
        </>
      ) : null}
    </GenericListPage>
  )
}
