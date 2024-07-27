import { useEffect, useMemo, useState } from "react"
import { PDFDownloadLink } from '@react-pdf/renderer'
import { toast } from "sonner"
import { ScreenLayout } from "../layouts/ScreenLayout"
import { SectionContainer } from "../layouts/SectionContainer"
import { ProgressLoading } from "../components/ProgressLoading"
import { ContactSheetPDF } from "../components/ContactSheetPDF"
import DragAndDrop from "../components/DragAndDrop"
import { LoadInfo } from "../components/LoadInfo"
import { useReadImageFiles } from "../hooks/useReadImageFiles"
import { useTransformImages } from "../hooks/useTransformImages"
import LoadFilesWorker from "../webworkers/loadFilesWorker?worker"

import { UploadFile } from "../types"


export default function ContactSheetScreen() {
  const worker = useMemo(() => new LoadFilesWorker(), [])
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { progress: readProgress, readFilesByBatch, error: filesWithReadError } = useReadImageFiles(50, worker)
  const { startTransform, progress: transformProgress } = useTransformImages(50)

  useEffect(() => {
    return () => {
      worker.terminate()
    }
  }, [worker])

  useEffect(() => {
    if (!isLoading && filesWithReadError.length > 0) {
      toast.error(
        `Error reading file${filesWithReadError.length > 1 ? 's': ''}: ${filesWithReadError.join(', ')}`,
        { duration: 10000}
      )
    }
  }, [filesWithReadError, isLoading])

  const handleUploadFiles = async (files: File[]) => {
    setIsLoading(true)
    console.log('files', files)
    const newFiles = await readFilesByBatch(files)
    const optimizedFiles = await startTransform(newFiles)
    setFiles(prev => [...prev, ...optimizedFiles])
    setIsLoading(false)
  }

  if (isLoading) {
    return (<ProgressLoading title="Loading Photos..." progress={readProgress + transformProgress}/>)
  }

  return (
    <ScreenLayout>
      <SectionContainer>
        <DragAndDrop onFilesSelected={handleUploadFiles} files={files.map(file => file.file)} />
        <LoadInfo filesCount={files.length} onClearFiles={() => setFiles([])} />
        {files.length > 0 && (
        <PDFDownloadLink
          document={<ContactSheetPDF images={files} />}
          fileName="contact-sheet.pdf"
          className="button primary bold large"
        >
          {({ loading }) =>
            loading
              ? "Loading ..." : "Download PDF"
          }
        </PDFDownloadLink>
      )}
      </SectionContainer>
    </ScreenLayout>
  )
}
