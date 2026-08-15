import { env } from '../config/env'
import { MEDIA_ALLOWED_IMAGE_MIME_TYPES } from '../constants/media'
import { HTTP_STATUS } from '../constants/http'
import { ApiError } from '../utils/api-error'

type SecurityScanResult = {
  safe: boolean
  reason?: string
}

async function runAntivirusScan(_file: Express.Multer.File): Promise<SecurityScanResult> {
  if (!env.MEDIA_ENABLE_AV_SCANNING) {
    return { safe: true }
  }

  // Hook point: integrate ClamAV/SaaS malware scanning provider here.
  return { safe: true }
}

function hasExecutableSignature(buffer: Buffer) {
  if (buffer.length < 4) {
    return false
  }

  const isPortableExecutable = buffer[0] === 0x4d && buffer[1] === 0x5a
  const isElf = buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46
  const isMachO = (buffer[0] === 0xfe && buffer[1] === 0xed)
    || (buffer[0] === 0xcf && buffer[1] === 0xfa)

  return isPortableExecutable || isElf || isMachO
}

export const mediaSecurityService = {
  async validateUploadedFile(file: Express.Multer.File) {
    if (!MEDIA_ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype as (typeof MEDIA_ALLOWED_IMAGE_MIME_TYPES)[number])) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Only image uploads are allowed in media library')
    }

    if (hasExecutableSignature(file.buffer)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Executable signatures are not allowed')
    }

    const scan = await runAntivirusScan(file)
    if (!scan.safe) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, scan.reason || 'File failed security scan')
    }
  },
}
