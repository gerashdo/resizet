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

export const readFile = (file: File): Promise<UploadFile | ErrorWithMessage> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        try {
          const buffer = new Uint8Array(reader.result as ArrayBuffer);
          const { width, height } = getJPEGDimensions(buffer)
          resolve({ file, url: reader.result as string, width, height });
        } catch (errorCatched) {
          console.error(errorCatched);
          resolve({ error: file.name });
        }
      }
    };
    reader.onerror = () => resolve({ error: file.name });
    reader.readAsArrayBuffer(file);
  });
}

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
      if (!done) resolve({ error: uploadFile.file.name })
    }, 10000);
  })
}

export const transformImagesInBatch = async (files: UploadFile[], batchSize: number, setProgress: (progress: number) => void): Promise<UploadFile[]> => {
  const totalFiles = files.length;
  const results: UploadFile[] = [];
  const errorFiles: string[] = [];
  let processedFiles = 0;

  const processBatch = (batch: UploadFile[]): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const batchResults = await Promise.all(batch.map(transformImage));
        batchResults.forEach(result => {
          if ('error' in result) {
            errorFiles.push(result.error);
          } else {
            results.push(result);
          }
        });
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

  if (errorFiles.length > 0) {
    console.error(`Error transforming images: ${errorFiles.join(', ')}`);
  }

  return results;
}

export const readFiles = async (files: File[]): Promise<readonly [UploadFile[], string[]]> => {
  const results: UploadFile[] = [];
  const errorFiles: string[] = [];

  const filesRead = await Promise.all(files.map(readFile))

  filesRead.forEach(result => {
    if ('error' in result) {
      errorFiles.push(result.error);
    } else {
      results.push(result);
    }
  });

  if (errorFiles.length > 0) {
    console.error(`Error transforming images: ${errorFiles.join(', ')}`);
  }

  return [results, errorFiles] as const;
};
