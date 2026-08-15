import { type Prisma } from '@prisma/client'

import { prisma } from '../lib/prisma'

export const rolesRepository = {
  findById(id: number) {
    return prisma.role.findFirst({
      where: { id, deletedAt: null },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    })
  },

  findBySlug(slug: string) {
    return prisma.role.findFirst({
      where: { slug, deletedAt: null },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    })
  },

  list(params: {
    where: Prisma.RoleWhereInput
    orderBy: Prisma.RoleOrderByWithRelationInput
    skip: number
    take: number
  }) {
    return prisma.$transaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.role.findMany({
          where: params.where,
          orderBy: params.orderBy,
          skip: params.skip,
          take: params.take,
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        }),
        tx.role.count({ where: params.where }),
      ])

      return { items, total }
    })
  },

  create(data: Prisma.RoleCreateInput) {
    return prisma.role.create({ data })
  },

  update(id: number, data: Prisma.RoleUpdateInput) {
    return prisma.role.update({ where: { id }, data })
  },

  softDelete(id: number) {
    return prisma.role.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'inactive' },
    })
  },

  countUsers(id: number) {
    return prisma.adminUserRole.count({ where: { roleId: id } })
  },

  countPermissions(id: number) {
    return prisma.rolePermission.count({ where: { roleId: id } })
  },

  replacePermissions(roleId: number, permissionIds: number[]) {
    return prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } })

      if (!permissionIds.length) {
        return tx.role.findFirst({ where: { id: roleId } })
      }

      await tx.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      })

      return tx.role.findFirst({ where: { id: roleId } })
    })
  },
}