import { useEffect, useMemo, useState } from 'react'

import {
  ActionToolbar,
  DeleteConfirmationDialog,
  EmptyState,
  GenericListPage,
  LoadingState,
  Modal,
  Pagination,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  SelectInput,
  StatusBadge,
  TextareaInput,
  TextInput,
} from '../../components/admin'
import { useToast } from '../../contexts/ui/ToastContext'
import { contactMessagesService } from '../../services/contact-messages.service'
import { type ContactMessageEntity, type ContactMessageListFilters } from '../../types/contact-messages'

type MessageItem = ContactMessageEntity

const STATUS_OPTIONS: Array<{ label: string; value: ContactMessageListFilters['quickFilter'] }> = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Read', value: 'read' },
  { label: 'Replied', value: 'replied' },
  { label: 'Archived', value: 'archived' },
]

export default function ContactMessagesPage() {
  const { pushToast } = useToast()
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ContactMessageListFilters['quickFilter']>('all')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedId, setSelectedId] = useState<string>('')
  const [archiveTarget, setArchiveTarget] = useState<MessageItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MessageItem | null>(null)
  const [replyTarget, setReplyTarget] = useState<MessageItem | null>(null)
  const [replyTemplateName, setReplyTemplateName] = useState('')
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [replyBody, setReplyBody] = useState('')

  const loadMessages = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await contactMessagesService.list({
        page,
        pageSize,
        search,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        filters: {
          quickFilter: status,
          status: status === 'all' ? undefined : status.toUpperCase() as MessageItem['status'],
        },
      })

      setMessages(result.items)
      setTotalPages(result.pagination.totalPages)
      setSelectedId((prev) => prev || String(result.items[0]?.id || ''))
    } catch (fetchError) {
      setError((fetchError as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadMessages, 250)
    return () => window.clearTimeout(timer)
  }, [page, pageSize, search, status])

  const selected = messages.find((row) => String(row.id) === selectedId) || messages[0] || null

  const updateMessageStatus = async (id: number, nextStatus: MessageItem['status']) => {
    try {
      await contactMessagesService.update(id, { status: nextStatus })
      loadMessages()
    } catch (updateError) {
      pushToast((updateError as Error).message || 'Unable to update message status', 'danger')
    }
  }

  const handleArchive = async () => {
    if (!archiveTarget) {
      return
    }

    await updateMessageStatus(archiveTarget.id, 'ARCHIVED')
    setArchiveTarget(null)
    pushToast('Message archived', 'warning')
  }

  const handleMarkRead = async (message: MessageItem) => {
    await updateMessageStatus(message.id, 'READ')
    pushToast('Message marked as read', 'success')
  }

  const handleRestore = async (message: MessageItem) => {
    await updateMessageStatus(message.id, 'READ')
    pushToast('Message restored from archive', 'success')
  }

  const openReply = (message: MessageItem) => {
    setReplyTarget(message)
    setReplyBody(`Hi ${message.name.split(' ')[0]},\n\nThanks for reaching out to Surf Mangalore.\n\n`)

    if (message.status === 'NEW') {
      void updateMessageStatus(message.id, 'READ')
    }
  }

  const submitReply = () => {
    if (!replyTarget) {
      return
    }

    void contactMessagesService.reply(replyTarget.id, { message: replyBody, subject: replyTarget.subject || undefined })
      .then(() => { pushToast('Reply sent successfully', 'success'); setReplyTarget(null); setReplyBody(''); void loadMessages() })
      .catch((error: unknown) => pushToast((error as Error).message || 'Unable to send reply', 'danger'))
  }

  const createTemplate = () => {
    if (!replyTemplateName.trim()) {
      pushToast('Template name cannot be empty', 'warning')
      return
    }

    pushToast(`Reply template "${replyTemplateName.trim()}" created`, 'success')
    setReplyTemplateName('')
    setTemplateModalOpen(false)
  }

  const rows = useMemo(
    () => messages.filter((message) => {
      const matchesSearch = `${message.name} ${message.subject} ${message.message}`.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    }),
    [messages, search],
  )

  return (
    <GenericListPage
      title="Contact Messages"
      description="Inbox workflow for customer enquiries with unread prioritization and quick action controls."
      actions={(
        <div className="flex flex-wrap items-center gap-2">
          <SecondaryButton onClick={loadMessages}>Refresh</SecondaryButton>
          <PrimaryButton onClick={() => setTemplateModalOpen(true)}>Create Reply Template</PrimaryButton>
        </div>
      )}
      filters={(
        <ActionToolbar>
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search sender, subject, or message" />
          <SelectInput label="Status" value={status} onChange={(value) => { setStatus(value as ContactMessageListFilters['quickFilter']); setPage(1) }} options={STATUS_OPTIONS} />
        </ActionToolbar>
      )}
    >
      {loading ? <LoadingState mode="table" /> : null}
      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
      {!loading && !rows.length ? <EmptyState title="Inbox is empty" description="No contact messages matched your current filter set." /> : null}

      {rows.length ? (
        <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="admin-card rounded-2xl border border-white/10 p-3">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-(--color-text-secondary)">Inbox</h3>
            <div className="flex flex-col gap-4">
              {rows.map((message) => {
                const isActive = selected?.id === message.id
                return (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() => setSelectedId(String(message.id))}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${isActive ? 'border-(--color-primary)/40 bg-(--color-primary)/10' : 'border-white/10 bg-white/4 hover:bg-white/8'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-(--color-text)">{message.name}</p>
                      {message.status === 'NEW' ? <StatusBadge tone="info" label="New" /> : message.status === 'ARCHIVED' ? <StatusBadge tone="warning" label="Archived" /> : message.status === 'REPLIED' ? <StatusBadge tone="positive" label="Replied" /> : <StatusBadge tone="neutral" label="Read" />}
                    </div>
                    <p className="mt-1 text-xs text-(--color-text-secondary)">{message.subject || 'No subject'}</p>
                    <p className="mt-2 line-clamp-2 text-xs text-(--color-text-secondary)">{message.message}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-widest text-(--color-text-secondary)">{new Date(message.createdAt).toLocaleString()}</p>
                  </button>
                )
              })}
            </div>
            <div className="mt-3 text-xs text-(--color-text-secondary)">Server pagination: page {page} of {totalPages}</div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </article>

          <article className="admin-card rounded-2xl border border-white/10 p-5">
            {selected ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-(--color-text)">{selected.subject || 'No subject'}</h3>
                    <p className="mt-1 text-sm text-(--color-text-secondary)">{selected.name} • {selected.email}</p>
                  </div>
                  <StatusBadge tone={selected.status === 'REPLIED' ? 'positive' : selected.status === 'ARCHIVED' ? 'warning' : selected.status === 'NEW' ? 'info' : 'neutral'} label={selected.status} />
                </div>

                <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-white/4 p-4 text-sm leading-7 text-(--color-text-secondary)">
                  <p><span className="font-medium text-(--color-text)">Customer:</span> {selected.name}</p>
                  <p><span className="font-medium text-(--color-text)">Email:</span> {selected.email}</p>
                  <p><span className="font-medium text-(--color-text)">Phone:</span> {selected.phone || 'Not provided'}</p>
                  <p><span className="font-medium text-(--color-text)">Subject:</span> {selected.subject || 'No subject'}</p>
                  <p className="pt-2"><span className="font-medium text-(--color-text)">Message:</span> {selected.message}</p>
                  <p><span className="font-medium text-(--color-text)">Submitted:</span> {new Date(selected.createdAt).toLocaleString()}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <PrimaryButton onClick={() => openReply(selected)}>Reply</PrimaryButton>
                  <SecondaryButton onClick={() => handleMarkRead(selected)}>Mark as read</SecondaryButton>
                  {selected.status === 'ARCHIVED' ? <SecondaryButton onClick={() => handleRestore(selected)}>Restore</SecondaryButton> : <SecondaryButton onClick={() => setArchiveTarget(selected)}>Archive</SecondaryButton>}
                  <SecondaryButton onClick={() => setDeleteTarget(selected)}>Delete</SecondaryButton>
                </div>
              </>
            ) : (
              <EmptyState title="No message selected" description="Choose a message from the inbox to view details." />
            )}
          </article>
        </section>
      ) : null}

      <DeleteConfirmationDialog
        isOpen={Boolean(archiveTarget)}
        resourceName={archiveTarget?.subject || 'message'}
        onCancel={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
      />

      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        resourceName={deleteTarget?.subject || 'message'}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) {
            return
          }

          await contactMessagesService.remove(deleteTarget.id)
          setDeleteTarget(null)
          loadMessages()
          pushToast('Message deleted', 'warning')
        }}
      />

      <Modal
        isOpen={templateModalOpen}
        title="Create Reply Template"
        onClose={() => setTemplateModalOpen(false)}
        footer={(
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setTemplateModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={createTemplate}>Create</PrimaryButton>
          </div>
        )}
      >
        <TextInput label="Template Name" value={replyTemplateName} onChange={(event) => setReplyTemplateName(event.target.value)} placeholder="e.g. Beginner Inquiry Reply" />
      </Modal>

      <Modal
        isOpen={Boolean(replyTarget)}
        title={replyTarget ? `Reply to ${replyTarget.name}` : 'Reply'}
        onClose={() => setReplyTarget(null)}
        footer={(
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setReplyTarget(null)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={submitReply} disabled={!replyBody.trim()}>Send Reply</PrimaryButton>
          </div>
        )}
      >
        <TextareaInput
          label="Reply Message"
          value={replyBody}
          onChange={(event) => setReplyBody(event.target.value)}
          placeholder="Write your reply..."
        />
      </Modal>
    </GenericListPage>
  )
}
