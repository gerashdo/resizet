export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return JSON.stringify(error)
}

export const getFailedImageNamesMessage = (errorImagesNames: string[]): string => {
  if (errorImagesNames.length === 0) return ''
  return `Error resizing images: ${errorImagesNames.join(', ')}`
}
