export type ApiSuccess<T> = {
  success: true
  message: string
  data: T
}

export type ApiFailure = {
  success: false
  message: string
  errors?: unknown
}
