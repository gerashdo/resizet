import { ImageIcon } from "./Icons/Image"

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
        <ImageIcon fillColor='rgb(115 115 115)'/>
        <p>{name}</p>
      </header>
      <a
        key={name}
        className="button secondary small"
        href={url}
        download={name}
      >
        Download
      </a>
    </li>
  )
}
