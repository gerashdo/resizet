import Resizer from "react-image-file-resizer"

import { UploadFile } from "../types"

export const getUniqueFiles = (newFiles: File[], existingFiles: File[]): File[] => {
  return newFiles.filter(newFile => {
    return !existingFiles.some(existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size)
  })
}

export const readFiles1 = (files: File[]): Promise<UploadFile[]> => {
  return Promise.all(
    files.map((file) => {
      return new Promise<UploadFile>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            resolve({ file, url: reader.result })
          } else {
            reject('Error reading file')
          }
        }
        reader.onerror = () => reject('Error reading file')
        reader.readAsDataURL(file)
      })
    })
  )
}

export const readFiles = (files: File[]): Promise<UploadFile[]> => {
  return Promise.all(
    files.map((file) => {
      return new Promise<UploadFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            resolve({ file, url: reader.result as string });
          } else {
            reject('Error reading file');
          }
        };
        reader.onerror = () => reject('Error reading file');
        reader.readAsDataURL(file);
      });
    })
  );
};

const needToBeRotated = (imageUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      resolve(height > width);
    };
    img.src = imageUrl;
  });
}

export const transformImages = (files: UploadFile[]): Promise<UploadFile[]> => {
  return Promise.all(
    files.map(async (uploadFile) => {
      return new Promise<UploadFile>((resolve) => {
        let rotation = 0;
        needToBeRotated(uploadFile.url as string).then((needRotation) => {
          if (needRotation) {
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
      });
    })
  );
};