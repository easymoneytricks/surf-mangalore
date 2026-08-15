import { type Prisma } from '@prisma/client'

import { prisma } from '../lib/prisma'

class SettingsRepository {
  async findByKey(settingKey: string) {
    return prisma.siteSetting.findFirst({
      where: {
        settingKey,
        deletedAt: null,
      },
    })
  }

  async upsertWebsiteSettings(params: {
    settingKey: string
    payload: Prisma.InputJsonValue
    userId?: number
  }) {
    return prisma.siteSetting.upsert({
      where: {
        settingKey: params.settingKey,
      },
      create: {
        slug: params.settingKey,
        name: 'Website Settings',
        title: 'Website Settings',
        description: 'Global website settings managed from admin CMS',
        status: 'active',
        settingKey: params.settingKey,
        settingType: 'JSON',
        valueJson: params.payload,
        isPublic: true,
        ...(params.userId ? { createdById: params.userId, updatedById: params.userId } : {}),
      },
      update: {
        status: 'active',
        settingType: 'JSON',
        valueJson: params.payload,
        isPublic: true,
        ...(params.userId ? { updatedById: params.userId } : {}),
      },
    })
  }
}

export const settingsRepository = new SettingsRepository()
