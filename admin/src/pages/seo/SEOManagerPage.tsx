import { useEffect, useMemo, useState } from 'react'

import {
  ActionToolbar,
  DeleteConfirmationDialog,
  EmptyState,
  GenericListPage,
  GenericDataTable,
  LoadingState,
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
import { seoService } from '../../services/seo.service'
import { type AdminSeoEntity, type AdminSeoMutationInput } from '../../types/seo'

export default function SEOManagerPage() {
  const { pushToast } = useToast()
  const [entries, setEntries] = useState<AdminSeoEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<AdminSeoEntity | null>(null)

  const [editor, setEditor] = useState<AdminSeoMutationInput>({
    name: '',
    title: '',
    routePath: '/',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    canonicalUrl: '',
    robots: 'index,follow',
    openGraphTitle: '',
    openGraphDescription: '',
    openGraphImage: '',
    publishStatus: 'DRAFT',
    visibility: 'PUBLIC',
    status: 'active',
  })

  const loadEntries = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await seoService.list({
        page,
        pageSize,
        search,
        quickFilter: status,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      })

      setEntries(result.items)
      setTotalPages(result.pagination.totalPages)
      const firstId = result.items[0]?.id ?? null
      setSelectedId((prev) => prev ?? firstId)
    } catch (requestError) {
      setError((requestError as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadEntries, 250)
    return () => window.clearTimeout(timer)
  }, [page, pageSize, search, status])

  const rows = useMemo(() => entries, [entries])
  const selectedEntry = entries.find((entry) => entry.id === selectedId) || entries[0] || null

  useEffect(() => {
    if (!selectedEntry) {
      return
    }

    setEditor({
      name: selectedEntry.name,
      title: selectedEntry.title,
      slug: selectedEntry.slug,
      routePath: selectedEntry.routePath,
      canonicalUrl: selectedEntry.canonicalUrl || '',
      metaTitle: selectedEntry.metaTitle,
      metaDescription: selectedEntry.metaDescription || '',
      metaKeywords: selectedEntry.metaKeywords,
      robots: (selectedEntry.robots as AdminSeoMutationInput['robots']) || 'index,follow',
      openGraphTitle: selectedEntry.openGraphTitle || '',
      openGraphDescription: selectedEntry.openGraphDescription || '',
      openGraphImage: selectedEntry.openGraphImage || '',
      publishStatus: selectedEntry.publishStatus,
      visibility: selectedEntry.visibility,
      status: selectedEntry.status,
    })
  }, [selectedEntry])

  const applySuggestions = () => {
    if (!editor.metaDescription) {
      return
    }

    const nextDescription = editor.metaDescription.length > 150
      ? editor.metaDescription.slice(0, 150)
      : `${editor.metaDescription} Book now.`

    setEditor((prev) => ({
      ...prev,
      metaTitle: prev.metaTitle || `${prev.name} | Surf Mangalore`,
      metaDescription: nextDescription,
    }))
    pushToast('SEO suggestions applied', 'info')
  }

  const saveSelected = async () => {
    if (!selectedEntry) {
      return
    }

    try {
      await seoService.update(selectedEntry.id, {
        ...editor,
        metaKeywords: editor.metaKeywords,
      })
      await loadEntries()
      pushToast('SEO entry updated', 'success')
    } catch (requestError) {
      pushToast((requestError as Error).message, 'danger')
    }
  }

  const createEntry = async () => {
    try {
      const created = await seoService.create({
        name: 'New Page',
        title: 'New Page',
        routePath: `/new-page-${Date.now()}`,
        metaTitle: 'New Page | Surf Mangalore',
        metaDescription: 'Add page metadata',
        metaKeywords: ['surf mangalore'],
        canonicalUrl: '',
        robots: 'index,follow',
        publishStatus: 'DRAFT',
        visibility: 'PUBLIC',
        status: 'active',
      })
      setSelectedId(created.id)
      await loadEntries()
      pushToast('SEO entry created', 'success')
    } catch (requestError) {
      pushToast((requestError as Error).message, 'danger')
    }
  }

  const deleteEntry = async () => {
    if (!confirmTarget) {
      return
    }

    try {
      await seoService.remove(confirmTarget.id)
      setConfirmTarget(null)
      setSelectedId(null)
      await loadEntries()
      pushToast('SEO entry deleted', 'warning')
    } catch (requestError) {
      pushToast((requestError as Error).message, 'danger')
    }
  }

  return (
    <GenericListPage
      title="SEO Manager"
      description="Manage meta title, meta description, slug, canonical, Open Graph, Twitter card, and robots directives."
      actions={(
        <div className="flex flex-wrap items-center gap-2">
          <SecondaryButton onClick={applySuggestions}>Generate Suggestions</SecondaryButton>
          <SecondaryButton onClick={loadEntries}>Refresh</SecondaryButton>
          <PrimaryButton onClick={createEntry}>Create SEO Entry</PrimaryButton>
        </div>
      )}
      filters={(
        <ActionToolbar>
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search page or slug" />
          <SelectInput label="Status" value={status} onChange={(value) => { setStatus(value as 'all' | 'published' | 'draft'); setPage(1) }} options={[{ label: 'All', value: 'all' }, { label: 'Published', value: 'published' }, { label: 'Draft', value: 'draft' }]} />
        </ActionToolbar>
      )}
    >
      {loading ? <LoadingState mode="table" /> : null}
      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
      {!rows.length ? <EmptyState title="No SEO entries found" description="Adjust filters or add a page entry for optimization." /> : null}

      {rows.length ? (
        <>
          <GenericDataTable<AdminSeoEntity>
            rows={rows}
            rowKey={(row) => String(row.id)}
            columns={[
              { key: 'name', header: 'Page', render: (row) => row.name },
              { key: 'routePath', header: 'Path', render: (row) => row.routePath },
              { key: 'metaTitle', header: 'Meta Title', render: (row) => row.metaTitle },
              { key: 'robots', header: 'Robots', render: (row) => row.robots || 'index,follow' },
              { key: 'status', header: 'Status', render: (row) => <StatusBadge tone={row.publishStatus === 'PUBLISHED' ? 'positive' : 'warning'} label={row.publishStatus} /> },
            ]}
            rowActions={(row) => (
              <div className="flex flex-wrap gap-1">
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setSelectedId(row.id)}>Edit</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setConfirmTarget(row)}>Delete</SecondaryButton>
              </div>
            )}
          />
          <div className="text-xs text-(--color-text-secondary)">Pagination placeholder: page {page} of {totalPages}</div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : null}

      {selectedEntry ? (
        <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/4 p-4 lg:grid-cols-2">
          <div className="space-y-3">
            <TextInput label="Page Name" value={editor.name} onChange={(event) => setEditor((prev) => ({ ...prev, name: event.target.value }))} />
            <TextInput label="Route Path" value={editor.routePath} onChange={(event) => setEditor((prev) => ({ ...prev, routePath: event.target.value }))} />
            <TextInput label="Meta Title" value={editor.metaTitle} onChange={(event) => setEditor((prev) => ({ ...prev, metaTitle: event.target.value }))} />
            <TextareaInput label="Meta Description" value={editor.metaDescription || ''} onChange={(event) => setEditor((prev) => ({ ...prev, metaDescription: event.target.value }))} />
            <TextInput label="Slug" value={editor.slug || ''} onChange={(event) => setEditor((prev) => ({ ...prev, slug: event.target.value }))} />
            <TextInput label="Canonical URL" value={editor.canonicalUrl || ''} onChange={(event) => setEditor((prev) => ({ ...prev, canonicalUrl: event.target.value }))} />
            <TextInput label="Open Graph Image" value={editor.openGraphImage || ''} onChange={(event) => setEditor((prev) => ({ ...prev, openGraphImage: event.target.value }))} />
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectInput
                label="Twitter Card"
                value="summary_large_image"
                onChange={() => undefined}
                options={[{ label: 'summary', value: 'summary' }, { label: 'summary_large_image', value: 'summary_large_image' }]}
              />
              <SelectInput
                label="Robots"
                value={editor.robots || 'index,follow'}
                onChange={(value) => setEditor((prev) => ({ ...prev, robots: value as AdminSeoMutationInput['robots'] }))}
                options={[{ label: 'index,follow', value: 'index,follow' }, { label: 'noindex,nofollow', value: 'noindex,nofollow' }, { label: 'noindex,follow', value: 'noindex,follow' }, { label: 'index,nofollow', value: 'index,nofollow' }]}
              />
            </div>
            <SelectInput
              label="Publish Status"
              value={editor.publishStatus}
              onChange={(value) => setEditor((prev) => ({ ...prev, publishStatus: value as AdminSeoMutationInput['publishStatus'] }))}
              options={[{ label: 'Published', value: 'PUBLISHED' }, { label: 'Draft', value: 'DRAFT' }, { label: 'Review', value: 'REVIEW' }, { label: 'Unpublished', value: 'UNPUBLISHED' }, { label: 'Archived', value: 'ARCHIVED' }]}
            />
            <PrimaryButton onClick={saveSelected}>Save SEO Changes</PrimaryButton>
          </div>

          <article className="rounded-2xl border border-white/12 bg-[linear-gradient(160deg,rgba(8,24,35,0.9),rgba(6,18,27,0.95))] p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-(--color-text-secondary)">Preview Card</p>
            <h3 className="mt-4 text-lg font-semibold text-(--color-primary)">{editor.metaTitle}</h3>
            <p className="mt-1 text-xs text-emerald-300">{editor.canonicalUrl || `https://surfmangalore.com${editor.routePath}`}</p>
            <p className="mt-3 text-sm leading-7 text-(--color-text-secondary)">{editor.metaDescription || 'Add a compelling description to improve CTR.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge tone="info" label="summary_large_image" />
              <StatusBadge tone={editor.robots === 'index,follow' ? 'positive' : 'warning'} label={editor.robots || 'index,follow'} />
            </div>
          </article>
        </section>
      ) : null}

      <DeleteConfirmationDialog
        isOpen={Boolean(confirmTarget)}
        resourceName={confirmTarget?.name || 'SEO entry'}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={deleteEntry}
      />
    </GenericListPage>
  )
}
