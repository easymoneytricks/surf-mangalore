import { v2 as cloudinary } from 'cloudinary'

import { env } from '../config/env'

let configured = false

export function isCloudinaryConfigured() {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET)
}

export function getCloudinaryFolderPrefix() {
  return env.CLOUDINARY_FOLDER_PREFIX || 'surfmangalore/cms'
}

function ensureCloudinaryConfigured() {
  if (configured) {
    return
  }

  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.')
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  })

  configured = true
}

type UploadBufferInput = {
  buffer: Buffer
  folder: string
  publicId: string
  resourceType?: 'image' | 'video' | 'raw' | 'auto'
  overwrite?: boolean
}

type CloudinaryUploadResult = {
  secure_url: string
  public_id: string
}

export function uploadBufferToCloudinary(input: UploadBufferInput) {
  ensureCloudinaryConfigured()

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: input.folder,
        public_id: input.publicId,
        resource_type: input.resourceType || 'image',
        overwrite: input.overwrite ?? false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'))
          return
        }

        resolve(result)
      },
    )

    stream.end(input.buffer)
  })
}

export async function deleteCloudinaryAsset(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
  ensureCloudinaryConfigured()
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
