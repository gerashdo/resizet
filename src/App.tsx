// import { ResizeScreen } from './screens/ResizeScreen'
import './App.css'
import { Toaster } from 'sonner'
import MainRouter from './MainRouter'

function App() {

  return (
    <>
      <MainRouter />
      <Toaster
        position='top-left'
        richColors
        toastOptions={{
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.87)',
            color: 'rgb(23 23 23)',
          },
          duration: 6000,
        }}
      />
    </>
  )
}

export default App
