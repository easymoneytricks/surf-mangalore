import SelectInput from './form/SelectInput'
import SwitchInput from './form/SwitchInput'

type PublishPanelProps = {
  publishStatus: string
  visibility: string
  featured: boolean
  scheduledPublishAt?: string
  onPublishStatusChange: (value: string) => void
  onVisibilityChange: (value: string) => void
  onFeaturedChange: (checked: boolean) => void
  onScheduledPublishAtChange: (value: string) => void
}

export default function PublishPanel(props: PublishPanelProps) {
  return (
    <section className="admin-card space-y-3 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-(--color-text)">Publish Workflow</h3>

      <SelectInput
        label="Publish Status"
        value={props.publishStatus}
        onChange={props.onPublishStatusChange}
        options={[
          { label: 'Draft', value: 'DRAFT' },
          { label: 'Review', value: 'REVIEW' },
          { label: 'Published', value: 'PUBLISHED' },
          { label: 'Unpublished', value: 'UNPUBLISHED' },
          { label: 'Archived', value: 'ARCHIVED' },
        ]}
      />

      <SelectInput
        label="Visibility"
        value={props.visibility}
        onChange={props.onVisibilityChange}
        options={[
          { label: 'Public', value: 'PUBLIC' },
          { label: 'Private', value: 'PRIVATE' },
          { label: 'Unlisted', value: 'UNLISTED' },
        ]}
      />

      <SwitchInput label="Featured" checked={props.featured} onChange={props.onFeaturedChange} />

      <label className="block space-y-1">
        <span className="text-xs font-medium tracking-[0.08em] text-(--color-text-secondary) uppercase">Scheduled Publish (Architecture)</span>
        <input
          type="datetime-local"
          value={props.scheduledPublishAt || ''}
          onChange={(event) => props.onScheduledPublishAtChange(event.target.value)}
          className="h-10 w-full rounded-xl border border-white/15 bg-white/6 px-3 text-sm text-(--color-text)"
        />
      </label>
    </section>
  )
}
