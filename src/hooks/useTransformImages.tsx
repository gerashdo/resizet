import { useRef, useState } from "react"
import { transformImagesInBatch } from "../helpers/loadFiles"
import { UploadFile } from "../types"


export const useTransformImages = (totalProgress: number = 100) => {
  const [progress, setProgress] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const progressConstantRef = useRef<number>(0)

  const incrementProgress = (totalProcessed: number) => {
    setProgress(progressConstantRef.current * totalProcessed)
  }

  const startTransform = async (files: UploadFile[]) => {
    const constant = totalProgress / files.length
    progressConstantRef.current = constant
    setProgress(0)
    setLoading(true)

    const results = await transformImagesInBatch(files, 3, incrementProgress)
    setLoading(false)
    setTimeout(() => setProgress(0), 2000)
    return results
  }

  return { progress, loading, startTransform }
}
