import { FileWithBlob } from "../types"
import { ErrorWithMessage } from "../types"

type UseResizeImagesWithWorkerProps = {
  worker: Worker
  setProgress: React.Dispatch<React.SetStateAction<number>>
  files: File[]
  progressConstant: number
}

export const useResizeImagesWithWorker = ({
  worker,
  setProgress,
  files,
  progressConstant
}: UseResizeImagesWithWorkerProps) => {
  const startResize = async ( imageQuality: number, imageSize: number) => {
    if (!window.Worker) {
      console.error('Web Workers are not supported in this browser')
      return
    }
    const resizedImages: FileWithBlob[] = []
    const errorImagesNames: string[] = []

    for (const file of files) {
      const resizedImage = await resizeImageWithWorker(file, imageQuality, imageSize)
      if ('error' in resizedImage) {
        errorImagesNames.push(file.name)
        console.error(`Error resizing image ${file.name}: ${resizedImage.error}`)
      } else {
        resizedImages.push(resizedImage)
      }
      setProgress((prev) => prev + progressConstant)
    }

    return [resizedImages, errorImagesNames] as const
  }

  const resizeImageWithWorker = (file: File, imageQuality: number, imageSize: number): Promise<FileWithBlob | ErrorWithMessage> => {
    return new Promise((resolve) => {
      const { port1, port2 } = new MessageChannel()

      port2.onmessage = (event: MessageEvent<FileWithBlob | ErrorWithMessage>) => {
        resolve(event.data)
        port2.close()
      }

      worker.postMessage({ port: port1, file, imageQuality, imageSize }, [port1])
    })
  }

  return {
    startResize
  }
}
