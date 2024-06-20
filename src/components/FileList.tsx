import { FileItem } from './FIleItem'

import './FileList.css'

interface FileListProps {
  files: File[]
  onRemoveFile: (index: number) => void
}

export const FileList = ({ files, onRemoveFile }: FileListProps) => {
  if (!files.length) {
    return null
  }

  return (
    <section className='file-list'>
      <h2>Files list</h2>
      <ul>
        {files.map((file, index) => (
          <FileItem key={index} file={file} index={index} onRemoveFile={onRemoveFile} />
        ))}
      </ul>
    </section>
  )
}
