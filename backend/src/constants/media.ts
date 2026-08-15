export const MEDIA_SORT_FIELDS = ['createdAt', 'updatedAt', 'title', 'fileSizeBytes', 'width', 'height'] as const

export const MEDIA_SORT_ORDERS = ['asc', 'desc'] as const

export const MEDIA_STATUSES = ['active', 'archived'] as const

export const MEDIA_ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const

export const MEDIA_ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const

export const MEDIA_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

export const MEDIA_MAX_FILES_PER_UPLOAD = 12

export const MEDIA_MIN_WIDTH = 240

export const MEDIA_MIN_HEIGHT = 240

export const MEDIA_MAX_WIDTH = 8000

export const MEDIA_MAX_HEIGHT = 8000

export const MEDIA_OPTIMIZED_MAX_WIDTH = 2400

export const MEDIA_OPTIMIZED_MAX_HEIGHT = 2400

export const MEDIA_THUMBNAIL_SIZE = 480

export const MEDIA_WEBP_QUALITY = 82

export const MEDIA_THUMBNAIL_QUALITY = 74
