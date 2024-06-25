import { DownloadIcon } from "./Icons/Dowload"

import { AnchorObject } from "../types"
import './ResizedImageItem.css'

type ResizedImageItemProps = {
  anchorObject: AnchorObject
}

export const ResizedImageItem = ({ anchorObject }:ResizedImageItemProps) => {
  const { url, name } = anchorObject
  return (
    <li className="resized-item">
      <header className="item">
        <img src={url} alt={name} />
        <p>{ name.length > 20 && !name.slice(0,20).includes(' ') ? `${name.slice(0, 10)}...` : name}</p>
      </header>
      <a
        key={name}
        className="button small secondary"
        href={url}
        download={name}
      >
        <DownloadIcon fillColor="#6dc24b" /><span>Download</span>
      </a>
    </li>
  )
}
