
import { ImageIcon } from "./Icons/Image"

import "./FileItem.css"
import { TrashIcon } from "./Icons/Trash"

interface FileItemProps {
    file: File
    index: number
    onRemoveFile: (index: number) => void
}

export const FileItem = ({ file, index, onRemoveFile}: FileItemProps) => {
  return (
    <li className="file-item">
      <header>
        <ImageIcon fillColor="#fff"/>
        <p>{file.name}</p>
      </header>
      <footer className="foother">
        <button className="danger small" onClick={() => onRemoveFile(index)}>
          <TrashIcon fillColor="#fff" />
        </button>
      </footer>
    </li>
  )
}