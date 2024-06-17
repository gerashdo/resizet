import { ResizeItLogo } from "./Icons/ResizeITLogo"

import './ResizeNav.css'

export const ResizeNav = () => {
  return (
    <div className="nav-container">
      <div className="logo">
        <ResizeItLogo fillColor='#6dc24b' />
      </div>
      <h1>Resize<span>IT</span></h1>
    </div>
  )
}