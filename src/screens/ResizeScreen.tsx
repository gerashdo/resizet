import { useState } from "react"
import DragAndDrop from "../components/DragAndDrop"
import RangeSlider from "../components/RangeSlider"
import { FileList } from "../components/FileList"

import "./ResizeScreen.css"

export const ResizeScreen = () => {
  const [files, setFiles] = useState<File[]>([])
  const [imageQuality, setImageQuality] = useState<number>(100)
  const [imageSize, setImageSize] = useState<number>(100)
  const [isCompressing, setIsCompressing] = useState<boolean>(false)

  const handleResize = async () => {
    setIsCompressing(true)

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const image = await resize(file);
      if (image) await downloadFile(image)
    }

    // files.forEach(async (file) => {
    //   const image = await resize(file)
    //   if (image) downloadFile(image)
    // })

    // const resizedPromises = files.map((file) => resize(file))
    // const resizedImages = await Promise.all(resizedPromises)
    // resizedImages.forEach((image) => {
    //   if (image) downloadFile(image)
    // })
    setFiles([])
    setIsCompressing(false)
  }

  const downloadFile = (image: HTMLAnchorElement): Promise<boolean> => {
    return new Promise((resolve) => {
      document.body.appendChild(image)
      image.click()
      document.body.removeChild(image)
      resolve(true)
    })
  }

  const resize = (file: File): Promise<HTMLAnchorElement | null> => {
    return new Promise((resolve) => {
      const image = new Image()
      image.src = URL.createObjectURL(file)
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const a = document.createElement("a");
        const ctx = canvas.getContext("2d");
        console.log(file.name)

        canvas.width = image.naturalWidth * (imageSize/100)
        canvas.height = image.naturalHeight * (imageSize/100)
        if (ctx) {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
          a.href = canvas.toDataURL("image/jpeg", imageQuality/100);
          a.download = file.name
          resolve(a)
        }else{
          resolve(null)
          console.error('Error resizing image', file.name)
        }
      }
    })
  }

  return (
    <main>
      <h1>Resize<span>IT</span></h1>
      <div className="drag-drop">
        <DragAndDrop onFilesSelected={setFiles} files={files} width="30rem" height='18rem'/>
      </div>
      { isCompressing && <p>Compressing...</p>}
      { files.length > 0 && (
        <div className="upload-settings">
          <div className="settings">
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
          <div>
            <button className="primary bold large" onClick={handleResize}>
              Resize and Download
            </button>
          </div>
        </div>
      )}
      <FileList files={files} onRemoveFile={(index) => setFiles(files.filter((_, i) => i !== index))} />
    </main>
  )
}