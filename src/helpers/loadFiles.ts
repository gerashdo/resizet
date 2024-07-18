import Resizer from "react-image-file-resizer"
import jpeg from "jpeg-js"

import { ErrorWithMessage, UploadFile } from "../types"

export const getUniqueFiles = (newFiles: File[], existingFiles: File[]): File[] => {
  return newFiles.filter(newFile => {
    return !existingFiles.some(existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size)
  })
}

const getJPEGDimensions = (buffer: Uint8Array): { width: number, height: number } => {
  const decoded = jpeg.decode(buffer, { useTArray: true })
  return { width: decoded.width, height: decoded.height }
}

const readFile = (file: File): Promise<UploadFile> => {
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

export const readFilesInBatch = async (files: File[], batchSize: number, setProgress: (progress: number) => void): Promise<UploadFile[]> => {
  const totalFiles = files.length;
  const results: UploadFile[] = [];
  let processedFiles = 0;

  const processBatch = (batch: File[]): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const batchResults = await Promise.all(batch.map(readFile));
        results.push(...batchResults);
        processedFiles += batch.length;
        setProgress(processedFiles);
        resolve();
      }, 0);
    });
  };

  for (let i = 0; i < totalFiles; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    await processBatch(batch);
  }

  return results;
};

export const transformImage = (uploadFile: UploadFile) => {
  return new Promise<UploadFile | ErrorWithMessage>((resolve) => {
    let rotation = 0;
    if (uploadFile.width && uploadFile.height && (uploadFile.height > uploadFile.width)) {
      rotation = 90;
    }
    let done = false
    Resizer.imageFileResizer(
      uploadFile.file,
      1000,
      1000,
      'JPEG',
      100,
      rotation,
      (uri) => {
        done = true
        resolve({ file: uploadFile.file, url: uri as string })
      },
      'base64'
    )

    setTimeout(() => {
      if (!done) resolve({ error: 'Error resizing image' })
    }, 10000);
  })
}

export const transformImages = async(files: UploadFile[]) => {
  const errorFiles: string[] = []
  const transformedFiles: UploadFile[] = []

  for (let i = 0; i < files.length; i++) {
    const transformedFile = await transformImage(files[i])
    if ('error' in transformedFile) {
      errorFiles.push(files[i].file.name)
    } else {
      transformedFiles.push(transformedFile)
    }
  }

  if (errorFiles.length > 0) {
    console.error(`Error transforming images: ${errorFiles.join(', ')}`)
  }

  return transformedFiles
}
