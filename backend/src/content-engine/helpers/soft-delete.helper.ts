export function buildSoftDeleteUpdate(updatedById?: number) {
  return {
    deletedAt: new Date(),
    status: 'deleted',
    ...(updatedById ? { updatedById } : {}),
  }
}
