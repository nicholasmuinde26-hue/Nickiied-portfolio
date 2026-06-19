import { useState } from 'react'


function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showGreeting, setShowGreeting] = useState(true)

  // Auto-hide greeting after 5s
  setTimeout(() => setShowGreeting(false), 5000)

  const whatsappNumber = "254792971466" // replace with your number
  const whatsappMsg = "Hi Nickiied, I have a question about your services"

  return (
    <>
      {/* WhatsApp Button - bottom left */}
      <a 
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`}
        target="_blank"
        className="whatsapp-btn"
      >
        <i className='bx bxl-whatsapp'></i>
        <span>WhatsApp us!</span>
      </a>

      {/* Chat Bubble - bottom right */}
      <div className="chat-widget">
        {/* Greeting bubble */}
        {showGreeting && !isOpen && (
          <div className="chat-greeting">
            <span>👋 Hi! How can we help?</span>
            <button onClick={() => setShowGreeting(false)}>✕</button>
          </div>
        )}

        {/* Chat window */}
        {isOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <h4>Chat with Nickiied</h4>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <div className="chat-body">
              <div className="bot-msg">
                👋 Hi! How can we help?
              </div>
              <div className="quick-replies">
                <button onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}>
                  I have a question
                </button>
                <button onClick={() => window.scrollTo({top: document.getElementById('about').offsetTop, behavior: 'smooth'})}>
                  Tell me more
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating button with notification badge */}
        <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
          <i className='bx bx-message-rounded-dots'></i>
          {!isOpen && <span className="badge">1</span>}
        </button>
      </div>
    </>
  )
}

export default ChatWidget