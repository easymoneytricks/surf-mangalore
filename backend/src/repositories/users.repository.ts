import { type Prisma } from '@prisma/client'

import { prisma } from '../lib/prisma'

export const usersRepository = {
  findById(id: number) {
    return prisma.adminUser.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })
  },

  findByEmail(email: string) {
    return prisma.adminUser.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    })
  },

  findBySlug(slug: string) {
    return prisma.adminUser.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    })
  },

  list(params: {
    where: Prisma.AdminUserWhereInput
    orderBy: Prisma.AdminUserOrderByWithRelationInput
    skip: number
    take: number
  }) {
    return prisma.$transaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.adminUser.findMany({
          where: params.where,
          orderBy: params.orderBy,
          skip: params.skip,
          take: params.take,
        }),
        tx.adminUser.count({ where: params.where }),
      ])

      return { items, total }
    })
  },

  create(data: Prisma.AdminUserCreateInput) {
    return prisma.adminUser.create({
      data,
    })
  },

  update(id: number, data: Prisma.AdminUserUpdateInput) {
    return prisma.adminUser.update({
      where: { id },
      data,
    })
  },

  updatePassword(id: number, passwordHash: string, mustChangePassword: boolean) {
    return prisma.adminUser.update({
      where: { id },
      data: {
        passwordHash,
        mustChangePassword,
      },
    })
  },

  softDelete(id: number) {
    return prisma.$transaction(async (tx) => {
      await tx.adminSession.updateMany({
        where: { adminUserId: id, revokedAt: null },
        data: { revokedAt: new Date(), status: 'revoked' },
      })

      return tx.adminUser.update({
        where: { id },
        data: {
          status: 'inactive',
          deletedAt: new Date(),
        },
      })
    })
  },

  findPrimaryRoleAssignment(adminUserId: number) {
    return prisma.adminUserRole.findFirst({
      where: { adminUserId },
    })
  },

  replacePrimaryRole(adminUserId: number, roleId: number) {
    return prisma.$transaction(async (tx) => {
      await tx.adminUserRole.deleteMany({
        where: { adminUserId },
      })

      await tx.adminUserRole.create({
        data: {
          adminUserId,
          roleId,
        },
      })

      return tx.adminUser.findFirst({
        where: {
          id: adminUserId,
          deletedAt: null,
        },
      })
    })
  },
}