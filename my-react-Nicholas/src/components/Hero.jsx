import { FaGithub, FaLinkedin, FaTiktok, FaEnvelope, FaArrowRight } from "react-icons/fa";

const Hero = ({ content }) => {

  // FALLBACKS so it doesn't break if API is empty
  const hero = {
    greeting: content?.hero?.greeting || import.meta.env.VITE_HERO_GREETING || "Hi, I'm",
    name: content?.hero?.name || import.meta.env.VITE_HERO_NAME || "Nicholas",
    roles: content?.hero?.roles?.length > 0 ? content.hero.roles : ["Developer", "Designer", "Security Enthusiast"],
    bio: content?.hero?.bio || import.meta.env.VITE_HERO_BIO || "I build secure, scalable web apps with the MERN stack.",
    ctaText: content?.hero?.ctaText || import.meta.env.VITE_HERO_CTA || "View Projects",
    profilePhoto: content?.hero?.profilePhoto || import.meta.env.VITE_HERO_PHOTO || "/images/profile.jpg"
  }

  const social = {
    github: content?.social?.github || import.meta.env.VITE_GITHUB,
    linkedin: content?.social?.linkedin || import.meta.env.VITE_LINKEDIN,
    tiktok: content?.social?.tiktok || import.meta.env.VITE_TIKTOK,
    email: content?.social?.email || import.meta.env.VITE_EMAIL || "your@email.com"
  }

  return (
    <section id="home" className="hero">
      <div className="home-info">
        <p className="hero-greeting reveal" data-delay="1">
          {hero.greeting} <span>{hero.name}</span>
        </p>
        
        <h2 className="reveal" data-delay="2">I'm a&nbsp;
          {hero.roles.map((role, i) => (
            <span key={i} style={{ '--i': hero.roles.length - i }} data-text={role}>{role}</span>
          ))}
        </h2>

        <div 
          className="hero-bio reveal" 
          data-delay="3" 
          dangerouslySetInnerHTML={{ __html: hero.bio }} 
        />

        <div className="hero-cta reveal" data-delay="4">
          <a href="#projects" className="cta-btn">
            {hero.ctaText} <FaArrowRight />
          </a>
          <div className="social-icons">
            {social.github && <a href={social.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>}
            {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>}
            {social.tiktok && <a href={social.tiktok} target="_blank" rel="noopener noreferrer"><FaTiktok /></a>}
            <a href={`mailto:${social.email}`}><FaEnvelope /></a>
          </div>
        </div>
      </div>

      <div className="hero-img reveal" data-delay="2">
        <div className="img-box">
          <div className="img-item">
            <img src={hero.profilePhoto} alt={hero.name} />
          </div>
        </div>
      </div>
    </section>
  )
}
export default Hero;