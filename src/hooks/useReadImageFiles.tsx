import { useState, useRef, useCallback } from "react"
import { UploadFile } from "../types"
import { getErrorMessage } from "../helpers/utils"


export const useReadImageFiles = (totalProgress: number = 100, worker: Worker) => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const progressConstantRef = useRef<number>(0)

  const incrementProgress = useCallback((totalProcessed: number) => {
    console.log({ totalProcessed, progressConstant: progressConstantRef.current })
    setProgress(progressConstantRef.current * totalProcessed)
  }, [])

  const readFilesByBatch = async (files: File[]): Promise<UploadFile[]> => {
    const batchConstant = 3
    setLoading(true)
    const constant = totalProgress / files.length
    progressConstantRef.current = constant
    setProgress(0)
    setError(null)

    let totalProcessed = 0
    const results: UploadFile[] = []

    for (let i = 0; i < files.length; i += batchConstant) {
      const batch = files.slice(i, i + batchConstant)
      console.log({ batch })
      try {
        const filesRead = await readFilesBatch(batch)
        console.log({ filesRead })
        results.push(...filesRead)
        totalProcessed += batch.length
        incrementProgress(totalProcessed)
        console.log({ totalProcessed })
      } catch (error) {
        console.log('error', error)
      }
    }
    console.log("finish")
    setLoading(false)
    return results
  }

  const readFilesBatch = async (files: File[]): Promise<UploadFile[]> => {
    return new Promise((resolve) => {
      worker.onmessage = (event: MessageEvent<UploadFile[]>) => {
        resolve(event.data)
      }

      worker.onerror = (error) => {
        const errorMessage = getErrorMessage(error)
        console.log('error', errorMessage)
      }

      try {
        worker.postMessage({ files })
        console.log('posting message')
      } catch (error) {
        console.log('error', error)
      }
    })
  }

  return {
    readFilesByBatch,
    loading,
    progress,
    error
  }
}
