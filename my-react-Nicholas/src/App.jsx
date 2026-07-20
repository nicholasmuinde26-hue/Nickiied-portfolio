import { Routes, Route } from 'react-router-dom'
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
  const navObserverRef = useRef(null)

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, projectsRes] = await Promise.all([
          axios.get(`${API}/api/content`).catch(() => ({data: {social: {email: "your@email.com"}}})) ,
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

  // OBSERVERS - Smooth reveal on scroll + Active Nav
  useEffect(() => {
    if (loading) return

    // 1. REVEAL OBSERVER
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay) || 0
            setTimeout(() => {
              entry.target.classList.add('show')
            }, delay * 100) // data-delay="3" = 300ms
            observerRef.current.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" } // triggers 80px before element hits bottom
    )

    const observeAll = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (!el.classList.contains('show')) {
          observerRef.current.observe(el)
        }
      })
    }
    observeAll()

    // 2. ACTIVE NAV OBSERVER
    navObserverRef.current = new IntersectionObserver(
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
      { rootMargin: '-90px 0px -55% 0px', threshold: 0.1 } // -90px = navbar height
    )
    document.querySelectorAll('section[id]').forEach(s => navObserverRef.current.observe(s))

    return () => {
      observerRef.current?.disconnect()
      navObserverRef.current?.disconnect()
    }
  }, [loading, content, projects]) // re-run when projects load so new cards get observed

  // SCROLL PROGRESS BAR
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
    <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <h2 style={{color:'var(--accent)'}}>Loading Portfolio<span className="dots">...</span></h2>
    </div>
  )

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
      <NickiiedPortfolio content={content} projects={projects} loading={loading} />
      <ChatWidget content={content} />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App