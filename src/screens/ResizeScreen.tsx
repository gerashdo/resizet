import { useState } from "react"
import DragAndDrop from "../components/DragAndDrop"
import RangeSlider from "../components/RangeSlider"
import { FileList } from "../components/FileList"

import "./ResizeScreen.css"

export const ResizeScreen = () => {
  const [files, setFiles] = useState<File[]>([])
  const [filesResized, setFilesResized] = useState<HTMLAnchorElement[]>([])
  const [imageQuality, setImageQuality] = useState<number>(100)
  const [imageSize, setImageSize] = useState<number>(100)
  const [isCompressing, setIsCompressing] = useState<boolean>(false)

  const handleResize = () => {
    setIsCompressing(true)
    files.forEach((file) => {
      resize(file)
    })
    filesResized.forEach((image) => {
      downloadFile(image)
    })
    setFilesResized([])
    setFiles([])
    setIsCompressing(false)
  }

  const downloadFile = (image: HTMLAnchorElement) => {
    image.click()
  }

  const resize = (file: File) => {
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const a = document.createElement("a");
      const ctx = canvas.getContext("2d");

      canvas.width = image.naturalWidth * (imageSize/100)
      canvas.height = image.naturalHeight * (imageSize/100)
      if (ctx) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        a.href = canvas.toDataURL("image/jpeg", imageQuality/100);
        a.download = new Date().getTime().toString();
        setFilesResized((prevFiles) => [...prevFiles, a])

      }
    }
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