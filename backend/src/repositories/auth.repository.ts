import { prisma } from '../lib/prisma'

export const authRepository = {
  updatePassword(adminUserId: number, passwordHash: string) {
    return prisma.adminUser.update({ where: { id: adminUserId }, data: { passwordHash, mustChangePassword: false } })
  },
  findAdminByEmail(email: string) {
    return prisma.adminUser.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    })
  },

  findAdminById(id: number) {
    return prisma.adminUser.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    })
  },

  createSession(params: {
    adminUserId: number
    refreshTokenHash: string
    expiresAt: Date
    ipAddress?: string
    userAgent?: string
  }) {
    return prisma.adminSession.create({
      data: {
        adminUserId: params.adminUserId,
        refreshTokenHash: params.refreshTokenHash,
        expiresAt: params.expiresAt,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    })
  },

  findSessionByUuid(sessionUuid: string) {
    return prisma.adminSession.findFirst({
      where: {
        uuid: sessionUuid,
        deletedAt: null,
      },
    })
  },

  rotateSession(params: {
    sessionUuid: string
    refreshTokenHash: string
    expiresAt: Date
    ipAddress?: string
    userAgent?: string
  }) {
    return prisma.adminSession.update({
      where: {
        uuid: params.sessionUuid,
      },
      data: {
        refreshTokenHash: params.refreshTokenHash,
        expiresAt: params.expiresAt,
        lastUsedAt: new Date(),
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    })
  },

  revokeSession(sessionUuid: string) {
    return prisma.adminSession.updateMany({
      where: {
        uuid: sessionUuid,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
        status: 'revoked',
      },
    })
  },

  touchLastLogin(adminUserId: number) {
    return prisma.adminUser.update({
      where: { id: adminUserId },
      data: { lastLoginAt: new Date() },
    })
  },
}
