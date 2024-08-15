
import './SectionContainer.css'

interface SectionContainerProps {
  children: React.ReactNode
}

export const SectionContainer = ({ children }: SectionContainerProps) => {
  return (
    <section className='section-container'>
      {children}
    </section>
  )
}
