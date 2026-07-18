import { useState, useEffect, useContext } from "react";
import { FaTimes, FaCopy, FaCheck, FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState('home');
  const { theme, toggleTheme } = useContext(ThemeContext);
  const email = "Nicholasmuinde26@gmail.com";

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const sections = navLinks.map(l => l.id);
      for (let sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) setActive(sec);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <nav className={`nav-bar ${scrolled? 'scrolled' : ''}`}>
        <div className="nav-logo">
          <a href="#home" onClick={() => handleLinkClick('home')}>
            <img src={content.nav.logo} alt="NickSpark" />
          </a>
        </div>

        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={active === link.id? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleLinkClick(link.id); }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark'? <FaSun /> : <FaMoon />}
          </button>
          <div className="nav-email" onClick={copyEmail}>
            {copied? <><FaCheck /> Copied</> : email}
          </div>
        </div>

        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mobile-menu ${isOpen? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <img src={content.nav.logo} alt="NickSpark" />
          <button onClick={() => setIsOpen(false)}><FaTimes /></button>
        </div>
        <div className="mobile-links">
          {navLinks.map(link => (
            <a key={link.id} href={`#${link.id}`} onClick={() => handleLinkClick(link.id)}>{link.label}</a>
          ))}
        </div>
        <button className="theme-toggle-mobile" onClick={toggleTheme}>
          {theme === 'dark'? <FaSun /> : <FaMoon />} {theme === 'dark'? 'Light Mode' : 'Dark Mode'}
        </button>
        <div className="mobile-email" onClick={copyEmail}>
          {copied? <><FaCheck /> Copied!</> : email}
        </div>
      </div>
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  )
}
export default Navbar;