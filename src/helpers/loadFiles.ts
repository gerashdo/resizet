
export const getUniqueFiles = (newFiles: File[], existingFiles: File[]): File[] => {
  return newFiles.filter(newFile => {
    return !existingFiles.some(existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size)
  })
}