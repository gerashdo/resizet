
import './LoadInfo.css'

interface LoadInfoProps {
  filesCount: number
  onClearFiles: () => void
}

export const LoadInfo = ({filesCount, onClearFiles}: LoadInfoProps) => {
  if (filesCount === 0) return null
  return (
    <div className="success-file">
      <p>{filesCount} file{ filesCount > 1 && 's'} selected</p>
      <button
        onClick={onClearFiles}
        className="danger"
      >
        Remove all
      </button>
    </div>
  )
}
