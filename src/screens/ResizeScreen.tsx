import { useEffect, useState } from "react"
import DragAndDrop from "../components/DragAndDrop"
import RangeSlider from "../components/RangeSlider"

export const ResizeScreen = () => {
  const [files, setFiles] = useState<File[]>([])
  const [filesResized, setFilesResized] = useState<HTMLAnchorElement[]>([])
  const [imageQuality, setImageQuality] = useState<number>(100)
  const [imageSize, setImageSize] = useState<number>(100)
  const [isCompressing, setIsCompressing] = useState<boolean>(false)
  useEffect(() => {
    console.log(files)
  }, [files])

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
    <div>
      <h1>Resize Screen</h1>
      { isCompressing && <p>Compressing...</p>}
      <DragAndDrop onFilesSelected={setFiles} files={files} width="30rem" height='30rem'/>
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
      <div>
        <button onClick={handleResize}>
          Resize and Download
        </button>
      </div>
    </div>
  )
}