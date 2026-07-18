import { FaGithub, FaLinkedin, FaTiktok, FaEnvelope, FaArrowRight } from "react-icons/fa";

const Hero = ({ content }) => {
  return (
    <section id="home" className="hero">
      <div className="home-info">
        <p className="hero-greeting">{content.hero.greeting} <span>{content.hero.name}</span></p>
        
        <h2>I'm a&nbsp;
          {content.hero.roles.map((role, i) => (
            <span key={i} style={{ '--i': content.hero.roles.length - i }} data-text={role}>{role}</span>
          ))}
        </h2>

        <div className="hero-bio" dangerouslySetInnerHTML={{ __html: content.hero.bio }} />

        <div className="hero-cta">
          <a href="#projects" className="cta-btn">
            {content.hero.ctaText} <FaArrowRight />
          </a>
          <div className="social-icons">
            {content.social.github && <a href={content.social.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>}
            {content.social.linkedin && <a href={content.social.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>}
            {content.social.tiktok && <a href={content.social.tiktok} target="_blank" rel="noopener noreferrer"><FaTiktok /></a>}
            <a href={`mailto:${content.social.email}`}><FaEnvelope /></a>
          </div>
        </div>
      </div>

      <div className="hero-img">
        <div className="img-box">
          <div className="img-item">
            <img src={content.hero.profilePhoto} alt={content.hero.name} />
          </div>
        </div>
      </div>
    </section>
  )
}
export default Hero;