import { UploadFile } from '../types'
import { FileItem } from './FIleItem'

import './FileList.css'

interface FileListProps {
  files: UploadFile[]
  title: string
  onRemoveFile: (index: number) => void
}

export const FileList = ({
  files,
  onRemoveFile,
  title
}: FileListProps) => {
  if (!files.length) {
    return null
  }

  return (
    <section className='file-list'>
      <h2>{title}</h2>
      <ul>
        {files.map((file, index) => (
          <FileItem
            key={index}
            name={file.file.name}
            url={file.url}
            index={index}
            onRemoveFile={onRemoveFile}
          />
        ))}
      </ul>
    </section>
  )
}
