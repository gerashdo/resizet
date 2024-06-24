import { useEffect, useMemo, useState } from 'react'
import DragAndDrop from '../components/DragAndDrop'
import RangeSlider from '../components/RangeSlider'
import { ResizeNav } from '../components/ReziseNav'
import { FileList } from '../components/FileList'
import { Loader } from '../components/Loader'
import { LoadInfo } from '../components/LoadInfo'
import { SectionContainer } from '../components/SectionContainer'
import { ResizedImagesList } from '../components/ResizedImagesList'
import { createDowndloadZip, getImagesAsAnchor } from '../helpers/resizeFiles'

import { AnchorObject, ResizeState } from '../types'
import './ResizeScreen.css'

export interface FileWithBlob {
  blob: Blob
  name: string
}

// Importar el Worker
import ImageWorker from '../webworkers/imageWorker?worker'

export const ResizeScreen = () => {
  const [files, setFiles] = useState<File[]>([])
  const [phase, setPhase] = useState<ResizeState>(ResizeState.TO_LOAD)
  const [imageQuality, setImageQuality] = useState<number>(100)
  const [imageSize, setImageSize] = useState<number>(100)
  const [anchorObjects, setAnchorObjects] = useState<AnchorObject[]>([])
  const [progress, setProgress] = useState<number>(0)
  const [progressConstant, setProgressConstant] = useState<number>(0)

  const worker = useMemo(() => new ImageWorker(), [])

  useEffect(() => {
    if (files.length > 0) {
      setPhase(ResizeState.LOADED)
      setProgressConstant(80 / files.length)
    }
  }, [files])

  const handleResize = async () => {
    if (imageQuality === 100 && imageSize === 100) return
    setPhase(ResizeState.COMPRESSING)

    const resizedImages: FileWithBlob[] = []
    let completed = 0

    for (const file of files) {
      const resizedImage = await resizeImageWithWorker(file, imageQuality, imageSize)
      if (resizedImage.error) {
        console.error(`Error resizing image ${file.name}: ${resizedImage.error}`)
      } else {
        resizedImages.push(resizedImage)
      }
      completed += 1
      setProgress((prev) => prev + progressConstant)

      if (completed === files.length) {
        setProgress(90)
        setAnchorObjects(getImagesAsAnchor(resizedImages))
        setProgress(100)
        setFiles([])
        setPhase(ResizeState.COMPRESSED)
        setProgress(0)
      }
    }
  }

  const resizeImageWithWorker = (file: File, imageQuality: number, imageSize: number): Promise<FileWithBlob> => {
    return new Promise((resolve) => {
      const { port1, port2 } = new MessageChannel()

      port2.onmessage = (event) => {
        resolve(event.data)
        port2.close()
      }

      worker.postMessage({ port: port1, file, imageQuality, imageSize }, [port1])
    })
  }

  const handleOnDownloadAll = () => {
    createDowndloadZip(anchorObjects, 'resized_images.zip')
  }

  const handleOnClear = () => {
    setAnchorObjects([])
    setPhase(ResizeState.TO_LOAD)
  }

  if (phase === ResizeState.COMPRESSING) {
    return (
      <div className="compressing">
        <Loader />
        <h2>{progress.toFixed(1)}%</h2>
        <p>Resizing</p>
      </div>
    )
  }

  return (
    <>
      <ResizeNav />
      <main>
        {(phase === ResizeState.TO_LOAD || phase === ResizeState.LOADED) && (
          <SectionContainer>
            <DragAndDrop onFilesSelected={setFiles} files={files} />
            <LoadInfo filesCount={files.length} onClearFiles={() => setFiles([])} />
            {files.length > 0 && phase === ResizeState.LOADED && (
              <>
                <div className="upload-settings">
                  <RangeSlider
                    label="Image Quality"
                    min={10}
                    max={100}
                    step={10}
                    initialValue={imageQuality}
                    onChange={(newValue) => setImageQuality(newValue)}
                  />
                  <RangeSlider
                    label="Image Size"
                    min={10}
                    max={100}
                    step={10}
                    initialValue={imageSize} onChange={(newValue) => setImageSize(newValue)}
                  />
                </div>
                <button className="primary bold large" onClick={handleResize}>
                  Resize Images
                </button>
              </>
            )}
          </SectionContainer>
        )}
        {files.length > 0 && phase === ResizeState.LOADED && (
          <SectionContainer>
            <FileList files={files} onRemoveFile={(index) => setFiles(files.filter((_, i) => i !== index))} />
          </SectionContainer>
        )}
        {anchorObjects.length > 0 && phase === ResizeState.COMPRESSED && (
          <SectionContainer>
            <ResizedImagesList
              anchorObjects={anchorObjects}
              onDownloadAll={handleOnDownloadAll}
              onClear={handleOnClear}
            />
          </SectionContainer>
        )}
      </main>
    </>
  )
}
