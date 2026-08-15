export function withCreateAudit<T extends object>(data: T, userId?: number) {
  if (!userId) {
    return data
  }

  return {
    ...data,
    createdBy: { connect: { id: userId } },
    updatedBy: { connect: { id: userId } },
  }
}

export function withUpdateAudit<T extends object>(data: T, userId?: number) {
  if (!userId) {
    return data
  }

  return {
    ...data,
    updatedBy: { connect: { id: userId } },
  }
}

export function withBulkUpdateAudit<T extends object>(data: T, userId?: number) {
  if (!userId) {
    return data
  }

  return {
    ...data,
    updatedById: userId,
  }
}
