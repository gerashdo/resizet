import { ChangeEvent, DragEvent } from 'react'
import { UploadLogo } from './UploadLogo';

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

  const handleRemoveFile = (index: number) => {
    onFilesSelected(files.filter((_, i) => i !== index))
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
              <p>Drag and drop your files here</p>
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
            <label htmlFor="browse" className="browse-btn">
              Browse files
            </label>
          </div>
        </>

        {files.length > 0 && (
          <div className="file-list">
            <div className="file-list__container">
              {files.map((file, index) => (
                <div className="file-item" key={index}>
                  <div className="file-info">
                    <p>{file.name}</p>
                    <p>{file.type}</p>
                  </div>
                  <div className="file-actions">
                    <button onClick={() => handleRemoveFile(index)}>Remove</button>
                    {/* <MdClear onClick={() => handleRemoveFile(index)} /> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="success-file">
            {/* <AiOutlineCheckCircle
              style={{ color: "#6DC24B", marginRight: 1 }}
            /> */}
            <p>{files.length} file(s) selected</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default DragAndDrop