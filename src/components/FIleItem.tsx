
import { TrashIcon } from "./Icons/Trash"
import "./FileItem.css"

interface FileItemProps {
    name: string
    url: string
    index: number
    onRemoveFile: (index: number) => void
}

export const FileItem = ({ name, url, index, onRemoveFile}: FileItemProps) => {
  return (
    <li className="file-item">
      <header>
        <img src={url} alt="file" />
        <p>{ name.length > 20 && !name.slice(0,20).includes(' ') ? `${name.slice(0, 10)}...` : name}</p>
      </header>
      <button className="danger small extended" onClick={() => onRemoveFile(index)}>
        <TrashIcon fillColor="#d44" /><span>Remove</span>
      </button>
    </li>
  )
}
