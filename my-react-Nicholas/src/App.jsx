import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NickiiedPortfolio from './NickiiedPortfolio'
import Admin from './Admin'
import './App.css'
import { useEffect, useState, useRef } from 'react'
import ChatWidget from './ChatWidget'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || "http://localhost:4000"

function Portfolio() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [content, setContent] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const observerRef = useRef(null)
  const mutationRef = useRef(null)

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, projectsRes] = await Promise.all([
          axios.get(`${API}/api/content`).catch(() => ({data: {social: {email: "your@email.com"}}})),
          axios.get(`${API}/api/projects`).catch(() => ({data: []}))
        ])
        setContent(contentRes.data || {social: {email: "your@email.com"}})
        setProjects(projectsRes.data || [])
      } catch (err) {
        console.error("Failed to fetch data", err)
        setContent({social: {email: "your@email.com"}})
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // OBSERVERS - Fade in on scroll + Active Nav
  useEffect(() => {
    if (loading) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
            observerRef.current.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    const observeElements = () => {
      document.querySelectorAll('section, .project-card, .contact-form, .about').forEach((el) => {
        if (!el.classList.contains('show')) {
          observerRef.current.observe(el)
        }
      })
    }

    observeElements()
    mutationRef.current = new MutationObserver(observeElements)
    mutationRef.current.observe(document.body, { childList: true, subtree: true })

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.querySelectorAll('.nav-links a').forEach(link => {
              link.classList.remove('active')
              if (link.getAttribute('href') === `#${entry.target.id}`) {
                link.classList.add('active')
              }
            })
          }
        })
      },
      { rootMargin: '-90px 0px -55% 0px', threshold: 0.1 }
    )
    document.querySelectorAll('section').forEach(s => navObserver.observe(s))

    return () => {
      observerRef.current?.disconnect()
      mutationRef.current?.disconnect()
      navObserver.disconnect()
    }
  }, [loading])

  // SCROLL PROGRESS
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) return (
    <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a0a'}}>
      <h2 style={{color:'#7cf03d'}}>Loading Portfolio<span className="dots">...</span></h2>
    </div>
  )

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
      <NickiiedPortfolio content={content} projects={projects} />
      <ChatWidget content={content} /> {/* PASS CONTENT HERE SO EMAIL DOESN'T CRASH */}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App