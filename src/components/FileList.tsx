import { useState } from 'react'

import './FileList.css'
import { FileItem } from './FIleItem'
import { ArrowIcon } from './Icons/Arrow'

interface FileListProps {
  files: File[]
  onRemoveFile: (index: number) => void
}

export const FileList = ({ files, onRemoveFile }: FileListProps) => {
  const [open, setOpen] = useState(false)
  if (!files.length) {
    return null
  }
  return (
    <section className='file-list'>
      <button
        className="collapsible"
        onClick={() => setOpen(!open)}
      >
        <span>Files list</span>
        <span className={`${open ? 'reverse' : ''}`}>
          <ArrowIcon fillColor='#fff' />
        </span>
      </button>
      <ul className={`${open ? 'active' : ''}`}>
        {files.map((file, index) => (
          <FileItem key={index} file={file} index={index} onRemoveFile={onRemoveFile} />
        ))}
      </ul>
    </section>
  )
}