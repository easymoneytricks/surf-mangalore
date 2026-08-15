import { useEffect, useMemo, useState } from 'react'

import {
  ActionToolbar,
  EmptyState,
  GenericDataTable,
  GenericListPage,
  LoadingState,
  Modal,
  Pagination,
  SearchBar,
  SecondaryButton,
  SelectInput,
  StatusBadge,
  TextInput,
} from '../../components/admin'
import { auditLogsService } from '../../services/audit-logs.service'
import { type AuditLogRecord, type AuditLogsListParams } from '../../types/audit-logs'

const PAGE_SIZE = 10

const ACTION_OPTIONS = [
  { label: 'All Actions', value: 'all' },
  { label: 'Login', value: 'LOGIN' },
  { label: 'Logout', value: 'LOGOUT' },
  { label: 'Create', value: 'CREATE' },
  { label: 'Update', value: 'UPDATE' },
  { label: 'Delete', value: 'DELETE' },
]

const RESOURCE_OPTIONS = [
  { label: 'All Resources', value: 'all' },
  { label: 'Users', value: 'USER' },
  { label: 'Roles', value: 'ROLE' },
  { label: 'Permissions', value: 'ROLE_PERMISSIONS' },
  { label: 'Bookings', value: 'BOOKING' },
  { label: 'Events', value: 'EVENT' },
  { label: 'Lessons', value: 'LESSON' },
  { label: 'Experiences', value: 'EXPERIENCE' },
  { label: 'Gallery', value: 'GALLERY' },
  { label: 'Media', value: 'MEDIA' },
  { label: 'Testimonials', value: 'TESTIMONIAL' },
  { label: 'FAQs', value: 'FAQ' },
  { label: 'Site Settings', value: 'SITE_SETTINGS' },
  { label: 'SEO', value: 'SEO' },
  { label: 'Authentication', value: 'AUTH_SESSION' },
]

function formatDateTime(value: string) {
  return new Date(value).toLocaleString()
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([])
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('all')
  const [resourceType, setResourceType] = useState('all')
  const [actorId, setActorId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null)
  const [error, setError] = useState<string | null>(null)

  const query = useMemo<AuditLogsListParams>(() => ({
    page,
    pageSize: PAGE_SIZE,
    search: search.trim() || undefined,
    action: action === 'all' ? undefined : action,
    resourceType: resourceType === 'all' ? undefined : resourceType,
    actorId: actorId.trim() ? Number(actorId) : undefined,
    from: from || undefined,
    to: to || undefined,
  }), [action, actorId, from, page, resourceType, search, to])

  const loadLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await auditLogsService.list(query)
      setLogs(result.items)
      setTotalPages(result.pagination.totalPages)
      setTotalItems(result.pagination.totalItems)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadLogs()
  }, [query])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  return (
    <GenericListPage
      title="Audit Logs"
      description="Track administrative actions by actor, resource, and request metadata."
      actions={<SecondaryButton onClick={() => void loadLogs()}>Refresh</SecondaryButton>}
      filters={(
        <ActionToolbar>
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search action, resource, description, or actor" />
          <SelectInput label="Action" value={action} onChange={(value) => { setAction(value); setPage(1) }} options={ACTION_OPTIONS} />
          <SelectInput label="Resource" value={resourceType} onChange={(value) => { setResourceType(value); setPage(1) }} options={RESOURCE_OPTIONS} />
          <TextInput label="Actor ID" value={actorId} onChange={(event) => { setActorId(event.target.value); setPage(1) }} />
          <TextInput label="From" type="date" value={from} onChange={(event) => { setFrom(event.target.value); setPage(1) }} />
          <TextInput label="To" type="date" value={to} onChange={(event) => { setTo(event.target.value); setPage(1) }} />
        </ActionToolbar>
      )}
    >
      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/12 px-3 py-2 text-sm text-rose-200">{error}</p> : null}
      {loading ? <LoadingState mode="table" /> : null}
      {!loading && !logs.length ? <EmptyState title="No audit logs found" description="Adjust the filters or wait for new activity to appear." /> : null}

      {!loading && logs.length ? (
        <>
          <GenericDataTable<AuditLogRecord>
            rows={logs}
            rowKey={(row) => String(row.id)}
            columns={[
              { key: 'actor', header: 'Actor', render: (row) => row.actor?.name || 'System' },
              { key: 'action', header: 'Action', render: (row) => row.action },
              { key: 'resource', header: 'Resource', render: (row) => row.resourceType },
              { key: 'resourceId', header: 'Resource ID', render: (row) => row.resourceId || '—' },
              { key: 'date', header: 'When', sortable: true, render: (row) => formatDateTime(row.createdAt) },
              { key: 'ipAddress', header: 'IP', render: (row) => row.ipAddress || '—' },
              {
                key: 'severity',
                header: 'Severity',
                render: (row) => <StatusBadge tone={row.action === 'DELETE' ? 'warning' : row.action === 'LOGIN' ? 'positive' : 'info'} label={row.action} />,
              },
            ]}
            rowActions={(row) => (
              <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setSelectedLog(row)}>View details</SecondaryButton>
            )}
          />

          <div className="text-xs text-(--color-text-secondary)">Showing {logs.length} logs on page {page} of {totalPages} • total {totalItems}</div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : null}

      <Modal
        isOpen={Boolean(selectedLog)}
        title="Audit Log Details"
        onClose={() => setSelectedLog(null)}
        footer={<div className="flex justify-end"><SecondaryButton onClick={() => setSelectedLog(null)}>Close</SecondaryButton></div>}
      >
        {selectedLog ? (
          <div className="space-y-3 text-sm text-(--color-text-secondary)">
            <div className="grid gap-2">
              <p><span className="font-medium text-(--color-text)">Who:</span> {selectedLog.actor?.name || 'System'}</p>
              <p><span className="font-medium text-(--color-text)">Email:</span> {selectedLog.actor?.email || 'System'}</p>
              <p><span className="font-medium text-(--color-text)">What:</span> {selectedLog.action}</p>
              <p><span className="font-medium text-(--color-text)">Resource:</span> {selectedLog.resourceType}</p>
              <p><span className="font-medium text-(--color-text)">Resource ID:</span> {selectedLog.resourceId || '—'}</p>
              <p><span className="font-medium text-(--color-text)">When:</span> {formatDateTime(selectedLog.createdAt)}</p>
              <p><span className="font-medium text-(--color-text)">IP:</span> {selectedLog.ipAddress || '—'}</p>
              <p><span className="font-medium text-(--color-text)">User Agent:</span> {selectedLog.userAgent || '—'}</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.14em] text-(--color-text-secondary)">Description</p>
              <p className="text-sm text-(--color-text)">{selectedLog.description}</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-black/20 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.14em] text-(--color-text-secondary)">Metadata</p>
              <pre className="overflow-x-auto text-xs text-(--color-text-secondary)">{JSON.stringify(selectedLog.metadata ?? {}, null, 2)}</pre>
            </div>
          </div>
        ) : null}
      </Modal>
    </GenericListPage>
  )
}
