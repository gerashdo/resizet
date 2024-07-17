import Resizer from "react-image-file-resizer"
import jpeg from "jpeg-js"

import { UploadFile } from "../types"

export const getUniqueFiles = (newFiles: File[], existingFiles: File[]): File[] => {
  return newFiles.filter(newFile => {
    return !existingFiles.some(existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size)
  })
}

export const getJPEGDimensions = (buffer: Uint8Array): { width: number, height: number } => {
  const decoded = jpeg.decode(buffer, { useTArray: true })
  return { width: decoded.width, height: decoded.height }
}

export const readFile = (file: File): Promise<UploadFile> => {
  return new Promise<UploadFile>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const buffer = new Uint8Array(reader.result as ArrayBuffer);
        const { width, height } = getJPEGDimensions(buffer)
        resolve({ file, url: reader.result as string, width, height });
      } else {
        reject('Error reading file');
      }
    };
    reader.onerror = () => reject('Error reading file');
    reader.readAsArrayBuffer(file);
  });
}

export const readImageFile = (file: File): Promise<UploadFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const buffer = new Uint8Array(reader.result as ArrayBuffer);
        const decoded = jpeg.decode(buffer, { useTArray: true });
        if (decoded) {
          resolve({ file, url: reader.result, width: decoded.width, height: decoded.height });
        } else {
          reject(new Error('Error decoding JPEG'));
        }
      } else {
        reject(new Error('Error reading file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsArrayBuffer(file);
  });
}

export const transformImages = (files: UploadFile[]): Promise<UploadFile[]> => {
  return Promise.all(
    files.map(async (uploadFile) => {
      return new Promise<UploadFile>((resolve) => {
        let rotation = 0;
        if (uploadFile.width && uploadFile.height && (uploadFile.height > uploadFile.width)) {
          rotation = 90;
        }
        Resizer.imageFileResizer(
          uploadFile.file,
          1000,
          1000,
          'JPEG',
          100,
          rotation,
          (uri) => {
            resolve({ file: uploadFile.file, url: uri as string })
          },
          'base64'
        )
      });
    })
  );
};