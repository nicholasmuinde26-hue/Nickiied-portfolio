import { useState, useEffect, useContext } from "react";
import { FaTimes, FaCopy, FaCheck, FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const email = "Nicholasmuinde26@gmail.com";

  const nav = {
    logo: content?.nav?.logo || import.meta.env.VITE_LOGO || "/logo.png"
  }

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if(el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch(err) { console.error("Copy failed", err) }
  }

  return (
    <>
      <nav className={`nav-bar ${scrolled? 'scrolled' : ''}`}>
        <div className="nav-logo reveal" data-delay="1">
          <a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('home'); }}>
            <img src={nav.logo} alt="NickSpark" />
          </a>
        </div>

        <ul className="nav-links">
          {navLinks.map((link, i) => (
            <li key={link.id} className="reveal" data-delay={i+2}>
              <a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); handleLinkClick(link.id); }}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <button className="theme-toggle reveal" data-delay="8" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark'? <FaSun /> : <FaMoon />}
          </button>
          <div className="nav-email reveal" data-delay="9" onClick={copyEmail}>
            {copied? <><FaCheck /> Copied</> : <><FaCopy /> {email}</>}
          </div>
        </div>

        <button className="hamburger reveal" data-delay="10" onClick={() => setIsOpen(!isOpen)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mobile-menu ${isOpen? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <img src={nav.logo} alt="NickSpark" />
          <button onClick={() => setIsOpen(false)}><FaTimes /></button>
        </div>
        <div className="mobile-links">
          {navLinks.map((link, i) => (
            <a key={link.id} className="reveal" data-delay={i+1} href={`#${link.id}`} onClick={(e) => { e.preventDefault(); handleLinkClick(link.id); }}>{link.label}</a>
          ))}
        </div>
        <button className="theme-toggle-mobile reveal" data-delay="8" onClick={toggleTheme}>
          {theme === 'dark'? <FaSun /> : <FaMoon />} {theme === 'dark'? 'Light Mode' : 'Dark Mode'}
        </button>
        <div className="mobile-email reveal" data-delay="9" onClick={copyEmail}>
          {copied? <><FaCheck /> Copied!</> : <><FaCopy /> Copy Email</>}
        </div>
      </div>
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  )
}
export default Navbar;