import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaCode, FaMapMarkerAlt } from "react-icons/fa";

const Footer = ({ content }) => {
  const currentYear = new Date().getFullYear();

  const stats = [
    { number: "3+", label: "Years Experience" },
    { number: "12+", label: "Projects Done" },
    { number: "50+", label: "Happy Clients" },
  ]

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* COL 1: BRAND + STATS */}
            <div className="footer-col brand-col">
              <div className="footer-logo">
                <FaCode /> <span>{content.hero.name}</span>
              </div>
              <p>
                Results-driven MERN Developer & Cybersecurity Student from Kenya. 
                I build scalable web apps, secure systems, and AI solutions that drive real results.
              </p>
              <div className="footer-stats">
                {stats.map((s, i) => (
                  <div key={i} className="stat-item">
                    <h4>{s.number}</h4>
                    <p>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* COL 2: QUICK LINKS */}
            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            {/* COL 3: CONTACT INFO */}
            <div className="footer-col">
              <h4>Get In Touch</h4>
              <ul className="contact-list">
                <li>
                  <FaEnvelope />
                  <a href={`mailto:${content.social.email}`}>{content.social.email}</a>
                </li>
                <li>
                  <FaMapMarkerAlt />
                  <span>Machakos, Kenya</span>
                </li>
              </ul>
              <div className="footer-social">
                {content.social.github && <a href={content.social.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>}
                {content.social.linkedin && <a href={content.social.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>}
                {content.social.tiktok && <a href={content.social.tiktok} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {currentYear} {content.hero.name}. All rights reserved. | Designed & Built with ❤️</p>
        </div>
      </div>
    </footer>
  )
}
export default Footer;