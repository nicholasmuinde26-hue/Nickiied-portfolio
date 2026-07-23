import { Routes, Route } from 'react-router-dom'
import NickiiedPortfolio from './NickiiedPortfolio'
import Admin from './Admin'
import './App.css'
import { useEffect, useState, useRef } from 'react'
import ChatWidget from './ChatWidget'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || "http://localhost:4000"
const CACHE_KEY = 'portfolio_cache'
const CACHE_TIME = 5 * 60 * 1000 // 5 minutes

function Portfolio() {
  const [scrollProgress, setScrollProgress] = useState(0)
  // Start with default data so UI renders immediately
  const [content, setContent] = useState({social: {email: "your@email.com"}})
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const observerRef = useRef(null)
  const navObserverRef = useRef(null)
  const cacheRef = useRef(null)

  // FETCH DATA + CACHE
  useEffect(() => {
    const fetchData = async () => {
      // 1. Check cache first
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_TIME) {
          setContent(data.content)
          setProjects(data.projects)
          setLoading(false)
          cacheRef.current = data
          return // instant load
        }
      }

      // 2. Fetch from API if no cache
      try {
        const [contentRes, projectsRes] = await Promise.all([
          axios.get(`${API}/api/content`),
          axios.get(`${API}/api/projects`)
        ])
        
        const newData = {
          content: contentRes.data,
          projects: projectsRes.data
        }
        
        setContent(newData.content)
        setProjects(newData.projects)
        cacheRef.current = newData
        
        // Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: newData,
          timestamp: Date.now()
        }))
        
      } catch (err) {
        console.error("Failed to fetch data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // OBSERVERS - Smooth reveal on scroll + Active Nav
  useEffect(() => {
    // Don't wait for loading anymore. Observe as soon as DOM exists
    const timer = setTimeout(() => {
      // 1. REVEAL OBSERVER
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = parseInt(entry.target.dataset.delay) || 0
              setTimeout(() => {
                entry.target.classList.add('show')
              }, delay * 40)
              observerRef.current.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
      )

      document.querySelectorAll('.reveal').forEach((el) => {
        if (!el.classList.contains('show')) {
          observerRef.current.observe(el)
        }
      })

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
        { rootMargin: '-90px 0px -55% 0px', threshold: 0.1 }
      )
      document.querySelectorAll('section[id]').forEach(s => navObserverRef.current.observe(s))
    }, 80)

    return () => {
      clearTimeout(timer)
      observerRef.current?.disconnect()
      navObserverRef.current?.disconnect()
    }
  }, [content, projects]) // re-run when data loads

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

  // Removed full-screen loading. Now loading is handled inside NickiiedPortfolio
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