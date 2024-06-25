import { ResizedImageItem } from "./RezisedImageItem"

import { AnchorObject } from "../types"
import './ResizedImagesList.css'

type ResizedImagesListProps = {
  anchorObjects: AnchorObject[]
  onDownloadAll: () => void
  onClear: () => void
}

export const ResizedImagesList = ({ anchorObjects, onDownloadAll, onClear }: ResizedImagesListProps) => {
  return (
    <div className="resized-section">
      <header>
        <h2><span>{anchorObjects.length}</span> resized file{ anchorObjects.length > 1 && 's'}</h2>
          <div className="action-buttons">
            {
              anchorObjects.length > 1 && (
                <button
                  className="button primary"
                  onClick={onDownloadAll}
                >
                  Download All
                </button>
              )
            }
            <button
              className="button secondary"
              onClick={onClear}
            >
              Clear and upload again
            </button>
          </div>
      </header>
      <ul>
        {anchorObjects.map((anchorObject, index) => {
          return (
            <ResizedImageItem key={index} anchorObject={anchorObject} />
          )
        })}
      </ul>
    </div>
  )
}
