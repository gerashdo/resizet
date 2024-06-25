import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import DragAndDrop from '../components/DragAndDrop'
import RangeSlider from '../components/RangeSlider'
import { ResizeNav } from '../components/ReziseNav'
import { FileList } from '../components/FileList'
import { LoadInfo } from '../components/LoadInfo'
import { ProgressLoading } from '../components/ProgressLoading'
import { SectionContainer } from '../components/SectionContainer'
import { ResizedImagesList } from '../components/ResizedImagesList'
import { useResizeImagesWithWorker } from '../hooks/useResizeImagesWithWorker'
import { createDowndloadZip, getImagesAsAnchor } from '../helpers/resizeFiles';

import { AnchorObject, ResizeState } from '../types'
import './ResizeScreen.css'

// Importar el Worker
import ImageWorker from '../webworkers/imageWorker?worker'
import { getFailedImageNamesMessage } from '../helpers/utils'

export const ResizeScreen = () => {
  const [files, setFiles] = useState<File[]>([])
  const [phase, setPhase] = useState<ResizeState>(ResizeState.TO_LOAD)
  const [imageQuality, setImageQuality] = useState<number>(100)
  const [imageSize, setImageSize] = useState<number>(100)
  const [anchorObjects, setAnchorObjects] = useState<AnchorObject[]>([])
  const [progress, setProgress] = useState<number>(0)
  const [progressConstant, setProgressConstant] = useState<number>(0)

  const worker = useMemo(() => new ImageWorker(), [])

  const { startResize } = useResizeImagesWithWorker({
    worker,
    setProgress,
    files,
    progressConstant
  })

  useEffect(() => {
    return () => {
      worker.terminate()
    }
  }, [worker])

  useEffect(() => {
    if (files.length > 0) {
      setPhase(ResizeState.LOADED)
      setProgressConstant(80 / files.length)
    }
  }, [files])

  const handleResize = async () => {
    if (imageQuality === 100 && imageSize === 100) return toast.info('The images are already at 100% quality and size')
    setProgress(0)
    setPhase(ResizeState.COMPRESSING)
    const resizedImages = await startResize(imageQuality, imageSize)
    setProgress(90)
    if ( !resizedImages || !resizedImages[0]){
      toast.error('No images where resized. Check if the browser supports Web Workers.')
      return setPhase(ResizeState.TO_LOAD)
    }
    if (resizedImages[1].length > 0) {
      toast.error(getFailedImageNamesMessage(resizedImages[1]))
    }
    setAnchorObjects(getImagesAsAnchor(resizedImages[0]))
    setProgress(100)
    setFiles([])
    setPhase(ResizeState.COMPRESSED)
  }

  const handleOnDownloadAll = () => {
    toast.promise(createDowndloadZip(anchorObjects, 'resized_images.zip'), {
      loading: 'Downloading images...',
      success: 'Images downloaded',
      error: 'Error downloading images'
    })
  }

  const handleOnClear = () => {
    setAnchorObjects([])
    setPhase(ResizeState.TO_LOAD)
  }

  if (phase === ResizeState.COMPRESSING) {
    return (<ProgressLoading progress={progress} />)
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
