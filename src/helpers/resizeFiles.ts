import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { FileWithBlob } from "../screens/ResizeScreen"

import { AnchorObject } from '../types'

export const getFailedImages = (resizedImages: PromiseSettledResult<FileWithBlob>[]) => {
  return resizedImages.filter((result) => result.status === 'rejected')
}

export const getSuccessImages = (resizedImages: PromiseSettledResult<FileWithBlob>[]): FileWithBlob[] => {
  const converted = resizedImages
    .filter((result) => result.status === 'fulfilled')
    .map((result) => (result.status === 'fulfilled' ? result.value : null))
    .filter((value) => value !== null) as FileWithBlob[]
  return converted
}

export const createDowndloadZip = (files: AnchorObject[], fileName: string) => {
  const zip = new JSZip();
  files.forEach((file) => {
    const { blob, name } = file
    zip.file(name, blob)
  })

  // Generate the zip file and download it
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, fileName);
  });
}

export const getImagesAsAnchor = (files: FileWithBlob[]) => {
  return files.map((file) => {
    const { blob, name } = file
    const url = URL.createObjectURL(blob)
    return { url, name, blob }
  })
}
