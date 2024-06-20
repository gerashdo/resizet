import { useState } from 'react'
import DragAndDrop from '../components/DragAndDrop'
import RangeSlider from '../components/RangeSlider'
import { ResizeNav } from '../components/ReziseNav'
import { FileList } from '../components/FileList'
import { Loader } from '../components/Loader'
import { LoadInfo } from '../components/LoadInfo'
import { SectionContainer } from '../components/SectionContainer'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import './ResizeScreen.css'

interface FileWithBlob {
  blob: Blob
  name: string
}

export const ResizeScreen = () => {
  const [files, setFiles] = useState<File[]>([])
  const [imageQuality, setImageQuality] = useState<number>(100)
  const [imageSize, setImageSize] = useState<number>(100)
  const [isCompressing, setIsCompressing] = useState<boolean>(false)

  const handleResize = async () => {
    if (imageQuality === 100 && imageSize === 100) return

    setIsCompressing(true)
    const zip = new JSZip();

    const resizePromises = files.map((file) => resize(file))
    const resizedImages = await Promise.allSettled(resizePromises)

    resizedImages.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { blob, name } = result.value
        zip.file(name, blob)
      } else {
        console.error('Error resizing image', result.reason)
      }
    })

    // Generate the zip file and download it
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'resized_images.zip');
    });

    setFiles([])
    setIsCompressing(false)
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
              const fileName = `${file.name.split('.')[0]}_resized.jpg`; // Create a custom file name
              resolve({ blob, name: fileName });
            } else {
              reject({error: 'Error creating blob', name: file.name})
            }
          }, 'image/jpeg', imageQuality / 100);
        }else{
          reject({error: 'Error resizing image', name: file.name})
        }
      }
      image.onerror = () => {
        reject({error: 'Error loading image', name: file.name})
      }
    })
  }

  if (isCompressing) {
    return (
      <div className="compressing">
        <Loader />
        <p>Compressing</p>
      </div>
    )
  }

  return (
    <>
      <ResizeNav />
      <main>
        <SectionContainer>
          <DragAndDrop onFilesSelected={setFiles} files={files} />
          <LoadInfo filesCount={files.length} onClearFiles={() => setFiles([])} />
          { files.length > 0 && (
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
                Resize and Download
              </button>
            </>
          )}
        </SectionContainer>
        {
          files.length > 0 && (
            <SectionContainer>
              <FileList files={files} onRemoveFile={(index) => setFiles(files.filter((_, i) => i !== index))} />
            </SectionContainer>
          )
        }
      </main>
    </>
  )
}
