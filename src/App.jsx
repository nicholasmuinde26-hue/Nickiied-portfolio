import NickiiedPortfolio from './Components'
import './App.css'
import { useEffect, useState } from 'react'
import ChatWidget from './ChatWidget'

function App() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    // 1. Fade-in observer for cards + form
     const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
          
          // Animate skill bars
          if (entry.target.classList.contains('about')) {
            entry.target.querySelectorAll('.skill-fill').forEach(fill => {
              fill.style.setProperty('--width', fill.dataset.percent)
            })
          }
        }
      })
    },
    { threshold: 0.2 }
  )

    document.querySelectorAll('.project-card,.contact-form,.about').forEach((el) => {
      observer.observe(el)
    })
 
    
    // 2. Active nav link on scroll
    const sections = document.querySelectorAll('section')
    const navLinks = document.querySelectorAll('.nav-links a')

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach(link => {
              link.classList.remove('active')
              if (link.getAttribute('href') === `#${entry.target.id}`) {
                link.classList.add('active')
              }
            })
          }
        })
      },
      { threshold: 0.6 }
    )

    sections.forEach(section => scrollObserver.observe(section))

    // 3. Scroll progress bar
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      const progress = docHeight > 0? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', updateScrollProgress)

    // Cleanup function - only ONE return
    return () => {
      observer.disconnect()
      scrollObserver.disconnect()
      window.removeEventListener('scroll', updateScrollProgress)
    }
  }, [])

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
      <NickiiedPortfolio />
      < ChatWidget />
    </>
  )
}

export default App