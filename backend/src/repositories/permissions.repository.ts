import { type Prisma } from '@prisma/client'

import { prisma } from '../lib/prisma'

export const permissionsRepository = {
  list(params: {
    where: Prisma.PermissionWhereInput
    orderBy: Prisma.PermissionOrderByWithRelationInput
  }) {
    return prisma.permission.findMany({
      where: params.where,
      orderBy: params.orderBy,
      include: {
        roles: true,
      },
    })
  },

  findById(id: number) {
    return prisma.permission.findFirst({
      where: { id, deletedAt: null },
      include: { roles: true },
    })
  },

  findBySlug(slug: string) {
    return prisma.permission.findFirst({
      where: { slug, deletedAt: null },
      include: { roles: true },
    })
  },

  countRoles(id: number) {
    return prisma.rolePermission.count({ where: { permissionId: id } })
  },
}