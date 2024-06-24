import { Loader } from "./Loader"

import './ProgressLoading.css'

type ProgressLoadingProps = {
  progress: number
}
export const ProgressLoading = ({ progress }: ProgressLoadingProps) => {
  return (
    <div className="compressing">
      <Loader />
      <h2>{progress.toFixed(1)}%</h2>
      <p>Resizing...</p>
    </div>
  )
}
