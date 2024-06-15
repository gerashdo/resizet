
import "./FileItem.css"

interface FileItemProps {
    file: File
    index: number
    onRemoveFile: (index: number) => void
}

export const FileItem = ({ file, index, onRemoveFile}: FileItemProps) => {
  return (
    <li>
      <p>{file.name}</p>
      <button className="danger small" onClick={() => onRemoveFile(index)}>
        Remove
      </button>
    </li>
  )
}