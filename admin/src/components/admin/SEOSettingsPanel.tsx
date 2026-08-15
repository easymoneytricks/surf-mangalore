import TextInput from './form/TextInput'
import TextareaInput from './form/TextareaInput'

type SEOSettingsPanelProps = {
  seoTitle: string
  seoDescription: string
  metaKeywords: string
  onSeoTitleChange: (value: string) => void
  onSeoDescriptionChange: (value: string) => void
  onMetaKeywordsChange: (value: string) => void
}

export default function SEOSettingsPanel(props: SEOSettingsPanelProps) {
  return (
    <section className="admin-card space-y-3 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-(--color-text)">SEO Settings</h3>

      <TextInput label="SEO Title" value={props.seoTitle} onChange={(event) => props.onSeoTitleChange(event.target.value)} />
      <TextareaInput
        label="SEO Description"
        value={props.seoDescription}
        onChange={(event) => props.onSeoDescriptionChange(event.target.value)}
        helpText={`${props.seoDescription.length}/320 characters`}
      />
      <TextInput
        label="Meta Keywords (comma separated)"
        value={props.metaKeywords}
        onChange={(event) => props.onMetaKeywordsChange(event.target.value)}
      />
    </section>
  )
}
