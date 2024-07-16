import { Link } from "wouter"
import { ResizeItLogo } from "./Icons/ResizeITLogo"

import './ResizeNav.css'

export const ResizeNav = () => {
  return (
    <div className="nav-container">

      <div className="logo">
        <ResizeItLogo fillColor='#6dc24b' />
        <h1>Resize<span>IT</span></h1>
      </div>
      <ul>
        <li>
          <Link href="/">Resize</Link>
        </li>
        <li>
          <a href="/contact-sheet">Contact Sheet</a>
        </li>
      </ul>
    </div>
  )
}