import { ReactNode } from "react";
import { ResizeNav } from "../components/ReziseNav";

import './ScreenLayout.css'

interface Props {
  children: ReactNode | ReactNode[];
}

export const ScreenLayout = ({ children }: Props) => {
  return (
    <>
      <ResizeNav />
      <main className="content-container">
        {children}
      </main>
    </>
  )
}