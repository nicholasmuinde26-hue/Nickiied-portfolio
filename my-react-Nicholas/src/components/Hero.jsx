import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaTiktok, FaEnvelope, FaArrowRight } from "react-icons/fa";

const buildSlides = (content) => {
  const heroData = content?.hero;

  if (Array.isArray(heroData?.slides) && heroData.slides.length > 0) {
    return heroData.slides;
  }

  const greeting = heroData?.greeting || import.meta.env.VITE_HERO_GREETING || "Hi, I'm";
  const name = heroData?.name || import.meta.env.VITE_HERO_NAME || "Nicholas";

  return [
    {
      greeting,
      name,
      role: heroData?.roles?.[0] || "Full-Stack Developer",
      bio:
        heroData?.bio ||
        import.meta.env.VITE_HERO_BIO ||
        "I build secure, scalable web apps with the MERN stack — from clean UI down to the API layer.",
      ctaText: heroData?.ctaText || import.meta.env.VITE_HERO_CTA || "View Projects",
    },
    {
      greeting: "Also building towards",
      role: "Cybersecurity & Pentesting",
      bio:
        "Currently deep in a hands-on security path — networking and Linux fundamentals, a home lab for Nmap and Wireshark, vulnerability scanning with Metasploit, web app testing with Burp Suite and the OWASP Top 10, with Active Directory up next.",
      ctaText: "See My Learning Path",
    },
  ];
};

const Hero = ({ content }) => {
  const slides = buildSlides(content);
  const [index, setIndex] = useState(0);

  const social = {
    github: content?.social?.github || import.meta.env.VITE_GITHUB,
    linkedin: content?.social?.linkedin || import.meta.env.VITE_LINKEDIN,
    tiktok: content?.social?.tiktok || import.meta.env.VITE_TIKTOK,
    email: content?.social?.email || import.meta.env.VITE_EMAIL || "your@email.com"
  }

  // Auto-advance through the slides. Pauses entirely if there's only one.
  useEffect(() => {
    if (slides.length <= 1) return;
    const tick = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(tick);
  }, [slides.length]);

  return (
    <section id="home" className="hero">
      <div className="hero-slides" aria-live="polite" aria-atomic="true">
        {slides.map((slide, i) => {
          const position = i === index ? "active" : i < index ? "prev" : "next";
          return (
            <div key={i} className={`hero-slide ${position}`} aria-hidden={i !== index}>
              <div className="home-info">
                <p className="hero-greeting reveal" data-delay="1">
                  {slide.greeting} <span>{slide.name}</span>
                </p>

                <h2 className="reveal" data-delay="2">
                 
                  <span className="hero-role" style={{ "--chars": slide.role.length }}>
                    {slide.role}
                  </span>
                </h2>

                <div
                  className="hero-bio reveal"
                  data-delay="3"
                  dangerouslySetInnerHTML={{ __html: slide.bio }}
                />

                <div className="hero-cta reveal" data-delay="4">
                  <a href="#projects" className="cta-btn">
                    {slide.ctaText} <FaArrowRight />
                  </a>
                  <div className="social-icons">
                    {social.github && <a href={social.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>}
                    {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>}
                    {social.tiktok && <a href={social.tiktok} target="_blank" rel="noopener noreferrer"><FaTiktok /></a>}
                    <a href={`mailto:${social.email}`}><FaEnvelope /></a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <div className="hero-slide-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hero-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1} of ${slides.length}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
export default Hero;