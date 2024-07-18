import { useState, useRef, useCallback } from "react"
import { readFilesInBatch } from "../helpers/loadFiles"
import { UploadFile } from "../types"

export const useReadImageFiles = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const progressConstantRef = useRef<number>(0)

  const incrementProgress = useCallback((totalProcessed: number) => {
    console.log({ totalProcessed, progressConstant: progressConstantRef.current })
    setProgress(progressConstantRef.current * totalProcessed)
  }, [])

  const readFiles = async (files: File[]): Promise<UploadFile[]> => {
    const constant = 50 / files.length
    console.log({constant})
    progressConstantRef.current = constant
    setLoading(true)
    setProgress(0)
    setError(null)

    const results = await readFilesInBatch(files, 3, incrementProgress)
    setLoading(false);
    return results;
  };

  return { loading, progress, error, readFiles }
}
