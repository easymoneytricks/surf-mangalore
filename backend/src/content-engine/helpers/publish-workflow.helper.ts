import { type PublishWorkflowInput } from '../types'

export function resolvePublishWorkflow(input: PublishWorkflowInput) {
  const resolvedPublishStatus = input.publishStatus
    || (input.scheduledPublishAt ? 'REVIEW' : 'DRAFT')

  return {
    publishStatus: resolvedPublishStatus,
    eventStatus: input.eventStatus || 'DRAFT',
    isFeatured: Boolean(input.featured),
    visibility: input.visibility || 'PUBLIC',
    scheduledPublishAt: input.scheduledPublishAt ? new Date(input.scheduledPublishAt) : undefined,
  }
}
