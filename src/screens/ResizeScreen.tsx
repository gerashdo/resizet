import { useEffect, useState } from 'react'
import DragAndDrop from '../components/DragAndDrop'
import RangeSlider from '../components/RangeSlider'
import { ResizeNav } from '../components/ReziseNav'
import { FileList } from '../components/FileList'
import { Loader } from '../components/Loader'
import { LoadInfo } from '../components/LoadInfo'
import { SectionContainer } from '../components/SectionContainer'
import { ResizedImagesList } from '../components/ResizedImagesList'
import { createDowndloadZip, getFailedImages, getImagesAsAnchor, getSuccessImages } from '../helpers/resizeFiles'

import { AnchorObject, ResizeState } from '../types'
import './ResizeScreen.css'

export interface FileWithBlob {
  blob: Blob
  name: string
}

export const ResizeScreen = () => {
  const [files, setFiles] = useState<File[]>([])
  const [phase, setPhase] = useState<ResizeState>(ResizeState.TO_LOAD)
  const [imageQuality, setImageQuality] = useState<number>(100)
  const [imageSize, setImageSize] = useState<number>(100)
  const [anchorObjects, setAnchorObjects] = useState<AnchorObject[]>([])
  const [progress, setProgress] = useState<number>(0)
  const [progressConstant, setProgressConstant] = useState<number>(0)

  useEffect(() => {
    if (files.length > 0) {
      setPhase(ResizeState.LOADED)
      setProgressConstant(Math.floor(80 / files.length))
    }
  }, [files])

  const handleResize = async () => {
    if (imageQuality === 100 && imageSize === 100) return
    setPhase(ResizeState.COMPRESSING)

    const resizePromises = files.map((file) => resize(file))
    const resizedImages = await Promise.allSettled(resizePromises)

    const failedImages = getFailedImages(resizedImages)

    if (failedImages.length === files.length) {
      console.error('All images failed to resize')
      setPhase(ResizeState.LOADED)
      return
    }
    setProgress(90)
    const successImages = getSuccessImages(resizedImages)
    setAnchorObjects(getImagesAsAnchor(successImages))
    setProgress(100)

    setFiles([])
    setPhase(ResizeState.COMPRESSED)
    setProgress(0)
  }

  const resize = (file: File): Promise<FileWithBlob> => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = URL.createObjectURL(file)
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = image.naturalWidth * (imageSize / 100)
        canvas.height = image.naturalHeight * (imageSize / 100)
        if (ctx) {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({ blob, name: file.name });
            } else {
              reject({error: 'Error creating blob', name: file.name})
            }
          }, 'image/jpeg', imageQuality / 100);
        }else{
          reject({error: 'Error resizing image', name: file.name})
        }
        setProgress((prev) => prev + progressConstant)
      }
      image.onerror = () => {
        reject({error: 'Error loading image', name: file.name})
      }
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
        <h2>{progress}%</h2>
        <p>Resizing</p>
      </div>
    )
  }

  return (
    <>
      <ResizeNav />
      <main>
        {
          (phase === ResizeState.TO_LOAD || phase === ResizeState.LOADED) && (
            <SectionContainer>
              <DragAndDrop onFilesSelected={setFiles} files={files} />
              <LoadInfo filesCount={files.length} onClearFiles={() => setFiles([])} />
              { files.length > 0 && phase === ResizeState.LOADED && (
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
          )
        }
        {
          files.length > 0 && phase === ResizeState.LOADED && (
            <SectionContainer>
              <FileList files={files} onRemoveFile={(index) => setFiles(files.filter((_, i) => i !== index))} />
            </SectionContainer>
          )
        }
        {
          anchorObjects.length > 0 && phase === ResizeState.COMPRESSED && (
            <SectionContainer>
              <ResizedImagesList
                anchorObjects={anchorObjects}
                onDownloadAll={handleOnDownloadAll}
                onClear={handleOnClear}
              />
            </SectionContainer>
          )
        }
      </main>
    </>
  )
}
