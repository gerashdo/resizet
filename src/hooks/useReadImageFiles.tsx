import { useState, useRef, useCallback } from "react"
import { readFilesInBatch } from "../helpers/loadFiles"
import { UploadFile } from "../types"
import { getErrorMessage } from "../helpers/utils"

export const useReadImageFiles = (totalProgress: number = 100) => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const progressConstantRef = useRef<number>(0)

  const incrementProgress = useCallback((totalProcessed: number) => {
    console.log({ totalProcessed, progressConstant: progressConstantRef.current })
    setProgress(progressConstantRef.current * totalProcessed)
  }, [])

  const readFiles = async (files: File[]): Promise<UploadFile[]> => {
    const constant = totalProgress / files.length
    progressConstantRef.current = constant
    setLoading(true)
    setProgress(0)
    setError(null)

    let results: UploadFile[] = []

    try {
      results = await readFilesInBatch(files, 3, incrementProgress)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
    }

    setLoading(false);
    return results;
  };

  return { loading, progress, error, readFiles }
}
