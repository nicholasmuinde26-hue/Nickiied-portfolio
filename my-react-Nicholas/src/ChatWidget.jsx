import { useState, useEffect, useRef } from 'react'
import { FaWhatsapp, FaTimes, FaEnvelope, FaArrowUp, FaRocketchat } from 'react-icons/fa'
import { IoSparkles } from "react-icons/io5"

function ChatWidget({ content }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const widgetRef = useRef(null)

  const whatsappNumber = "254792971466"
  const whatsappMsg = "Hi Nickiied, I have a question about your services"
  const email = content?.social?.email || "your@email.com"

  // CHANGED: Just 1 pro greeting
  const greeting = "I'm online. How can I help? ⚡"

  // Show for 1s, hide after 7s
  useEffect(() => {
    const showTimer = setTimeout(() => setShowGreeting(true), 1000)
    const hideTimer = setTimeout(() => setShowGreeting(false), 7000)

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleOpenChat = (e) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
    setShowGreeting(false)
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
        <FaWhatsapp /><span>WhatsApp</span>
      </a>

      <div className="chat-widget" ref={widgetRef}>
        {showGreeting && !isOpen && (
          <div className="greeting-container">
            <div className={`chat-greeting active`}>
              {greeting}
              <button className="close-greeting" onClick={() => setShowGreeting(false)}><FaTimes /></button>
            </div>
          </div>
        )}

        {isOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <h4>Let's Talk</h4>
              <button onClick={handleOpenChat} className="close-chat"><FaTimes /></button>
            </div>
            <div className="chat-body">
              <p>I'm usually available for freelance work and collabs.</p>
              <p>Best way to reach me:</p>
              <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer" className="chat-whatsapp-btn">
                <FaWhatsapp /> Chat on WhatsApp
              </a>
              <a href={`mailto:${email}`} className="chat-email-btn">
                <FaEnvelope /> Send Email
              </a>
            </div>
          </div>
        )}

        <button className="chat-toggle" onClick={handleOpenChat}>
          {isOpen ? <FaTimes /> : <><FaRocketchat /><IoSparkles className="sparkle" /></>}
          {!isOpen && <span className="badge">1</span>}
        </button>
      </div>

      <button className={`back-to-top-btn ${showTopBtn ? 'show' : ''}`} onClick={scrollToTop}>
        <FaArrowUp />
      </button>
    </>
  )
}

export default ChatWidget