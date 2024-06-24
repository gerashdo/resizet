import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import { AnchorObject, FileWithBlob } from '../types'
import { getErrorMessage } from './utils'

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

export const getImagesAsAnchor = (files: FileWithBlob[]): AnchorObject[] => {
  return files.map((file) => {
    const { blob, name } = file
    const url = URL.createObjectURL(blob)
    return { url, name, blob }
  })
}

export const resizeImage = async (file: File, imageQuality: number, imageSize: number): Promise<FileWithBlob> => {
  const imageBitmap = await createImageBitmap(file);
  const offScreenCanvas = new OffscreenCanvas(imageBitmap.width * (imageSize / 100), imageBitmap.height * (imageSize / 100));
  const ctx = offScreenCanvas.getContext('2d');

  if (!ctx) {
    throw new Error('Error resizing image');
  }

  ctx.drawImage(imageBitmap, 0, 0, offScreenCanvas.width, offScreenCanvas.height);

  return new Promise<{ blob: Blob; name: string }>((resolve, reject) => {
    offScreenCanvas.convertToBlob({ type: 'image/jpeg', quality: imageQuality / 100 }).then(blob => {
      resolve({ blob, name: file.name });
    }).catch(err => {
      const message = getErrorMessage(err);
      reject(new Error(message));
    });
  });
};


