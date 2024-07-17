import { useState } from "react"
import { ErrorWithMessage, UploadFile } from "../types"

export const useReadImageFilesWithWorker = (worker: Worker) => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const readImageFiles = async (files: File[]) => {
    setLoading(true)
    setProgress(0)
    setError(null)

    const newImages: UploadFile[] = []
    const errorImagesNames: string[] = []

    for (const file of files) {
      console.log('Hellor')
      const image = await readImageFile(file)
      if ('error' in image) {
        errorImagesNames.push(file.name)
        console.error(`Error reading image ${file.name}: ${image.error}`)
      } else {
        newImages.push(image)
      }
      setProgress((prev) => prev + (80 / files.length))
    }
    setLoading(false)

    if (errorImagesNames.length > 0) {
      setError(`Error reading images: ${errorImagesNames.join(', ')}`)
    }

    return newImages
  }

  const readImageFile = (file: File): Promise<UploadFile | ErrorWithMessage> => {
    return new Promise((resolve) => {
      // const { port1, port2 } = new MessageChannel()

      worker.onmessage = (event: MessageEvent<UploadFile>) => {
        resolve(event.data)
        console.log('Hello onmessage')
        // port2.close()
      }

      console.log('Hello readImageFile')
      console.log('worker', worker)
      // worker.postMessage({ port: port1, file }, [port1])
      worker.postMessage({ file })
      console.log('Hello after postMessage')
    })
  }

  return { loading, progress, error, readImageFiles }
}