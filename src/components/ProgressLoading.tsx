import { Loader } from "./Loader"

import './ProgressLoading.css'

type ProgressLoadingProps = {
  progress?: number
  title: string
}
export const ProgressLoading = ({ progress, title }: ProgressLoadingProps) => {
  return (
    <div className="compressing">
      <Loader />
      {progress !== undefined && <h2>{progress.toFixed(1)}%</h2>}
      <p>{title}</p>
    </div>
  )
}
