import { ChangeEvent, DragEvent } from 'react'
import { UploadLogo } from './Icons/UploadLogo';

import './DragAndDrop.css'

interface DragAndDropProps {
  onFilesSelected: (files: File[]) => void;
  files: File[]
  width: string
  height: string
}

const DragAndDrop = ({
  onFilesSelected,
  files,
  width,
  height,
}: DragAndDropProps) => {

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles)
      onFilesSelected([...files, ...newFiles])
    }
  }
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer.files
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles)
      onFilesSelected([...files, ...newFiles])
    }
  }

  return (
    <section className="drag-drop" style={{ width: width, height: height }}>
      <div
        className={`document-uploader ${
          files.length > 0 ? "upload-box active" : "upload-box"
        }`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <>
          <div className="upload-info">
            <UploadLogo fillColor='#6dc24b' />
            <div>
              <p>Drop your files here</p>
              <p>
                Supported files: .JPG, .JPEG
              </p>
            </div>
          </div>
          <div>
            <input
              type="file"
              hidden
              id="browse"
              onChange={handleFileChange}
              accept=".jpg, .jpeg"
              multiple
            />
            <label
              htmlFor="browse"
              className={`browse-btn ${files.length > 0 ? "loaded" : ""}`}
            >
              Browse files
            </label>
          </div>
        </>

        {files.length > 0 && (
          <div className="success-file">
            <p>{files.length} file(s) selected</p>
            <button
              onClick={() => onFilesSelected([])}
              className="secondary"
            >
              Remove all
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default DragAndDrop