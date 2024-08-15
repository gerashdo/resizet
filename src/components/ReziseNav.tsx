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
          <Link
            to="/"
            className={(active) => active ? "active": ""}
          >
            Resize
          </Link>
        </li>
        <li>
          <Link
            to="/contact-sheet"
            className={(active) => active ? "active": ""}
          >
            Contact Sheet
          </Link>
        </li>
      </ul>
    </div>
  )
}