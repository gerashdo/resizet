export type AnchorObject = {
  url: string
  name: string
  blob: Blob
}

export type UploadFile = {
  file: File
  url: string
}

export interface FileWithBlob {
  blob: Blob
  name: string
}

export enum ResizeState {
  TO_LOAD = 'TO_LOAD',
  LOADED = 'LOADED',
  COMPRESSING = 'COMPRESSING',
  COMPRESSED = 'COMPRESSED',
}

export type ErrorWithMessage = {
  error: string
}
