export type AnchorObject = {
  url: string
  name: string
  blob: Blob
}

export enum ResizeState {
  TO_LOAD = 'TO_LOAD',
  LOADED = 'LOADED',
  COMPRESSING = 'COMPRESSING',
  COMPRESSED = 'COMPRESSED',
}
