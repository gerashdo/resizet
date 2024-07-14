import { ReactNode } from "react";
import { ResizeNav } from "../components/ReziseNav";

interface Props {
  children: ReactNode | ReactNode[];
}

export const ScreenLayout = ({ children }: Props) => {
  return (
    <>
      <ResizeNav />
      {children}
    </>
  )
}