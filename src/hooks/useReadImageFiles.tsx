import { useState, useRef, useCallback } from "react"
import { UploadFile } from "../types"
import { getErrorMessage } from "../helpers/utils"


export const useReadImageFiles = (totalProgress: number = 100, worker: Worker) => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<string[]>([])
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
    setError([])

    let totalProcessed = 0
    const results: UploadFile[] = []

    for (let i = 0; i < files.length; i += batchConstant) {
      const batch = files.slice(i, i + batchConstant)
      console.log({ batch })
      try {
        const [filesRead, filesWithError ]= await readFilesBatch(batch)
        console.log({ filesRead })
        results.push(...filesRead)
        setError(prev => [...prev, ...filesWithError])
        totalProcessed += batch.length
        incrementProgress(totalProcessed)
        console.log({ totalProcessed })
      } catch (err) {
        setError(prev => [...prev, ...batch.map(file => file.name)])
        // console.log('error try', err)
      }
    }

    console.log("finish")
    setLoading(false)
    return results
  }

  const readFilesBatch = async (files: File[]): Promise<readonly [UploadFile[], string]> => {
    return new Promise((resolve, reject) => {
      let done = false
      worker.onmessage = (event: MessageEvent<readonly [UploadFile[], string]>) => {
        resolve(event.data)
        done = true
      }

      worker.onerror = (error) => {
        const errorMessage = getErrorMessage(error)
        reject(errorMessage)
        console.log('error', errorMessage)
      }

      try {
        worker.postMessage({ files })
        console.log('posting message')
        setTimeout(() => {
          if (!done) {
            reject('timeout')
          }
        }, 8000)
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        console.log('error', errorMessage)
        reject(errorMessage)
      }
    })
  }

  return {
    readFilesByBatch,
    loading,
    progress,
    error: error
  }
}
