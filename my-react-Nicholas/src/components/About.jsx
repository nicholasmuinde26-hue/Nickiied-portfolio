import { useEffect } from "react";
import { FaReact, FaNodeJs, FaServer, FaShieldAlt, FaBug, FaArrowRight, FaDownload } from "react-icons/fa";
import { MdCode, MdCloud } from "react-icons/md";
import { BsTerminal } from "react-icons/bs";

const About = ({ content }) => {

  useEffect(() => {
    const el = document.querySelector('.about-v2');
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && el.classList.add('show'), {threshold: 0.1});
    obs.observe(el);
  }, [])

  const skillCategories = [
    { title: "Frontend", icon: <FaReact />, skills: ["React", "Tailwind CSS", "TypeScript", "Responsive Design"] },
    { title: "Backend", icon: <FaNodeJs />, skills: ["Node.js", "Express", "MongoDB", "REST APIs"] },
    { title: "Cybersecurity", icon: <FaShieldAlt />, skills: ["Nmap", "Kubernetes", "Cloud Security", "Burp Suite"] },
    { title: "Tools", icon: <BsTerminal />, skills: ["Git/GitHub", "Docker", "Linux", "Postman"] },
  ]

  return (
    <section className="about-v2" id="about">
      <div className="container">
        <div className="about-header">
          <p className="section-tag">DEVELOPER & CYBERSECURITY SPECIALIST</p>
          <h2 className="heading">Building Secure <span>Digital Solutions</span></h2>
        </div>

        <div className="about-grid">
          <div className="about-left">
            <div className="photo-card">
              <div className="glow-border"></div>
              <img src={content.about.aboutPhoto} alt={content.hero.name} />
            </div>
            <div className="left-ctas">
              <a href="#projects" className="btn-primary">
                View My Projects <FaArrowRight />
              </a>
              <a href={content.about.cvLink} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Download CV <FaDownload />
              </a>
            </div>
          </div>

          <div className="about-right">
            <h3 className="about-headline">
              I'm Nicholas Muinde Mwanza — a Computer Science student at <strong>Machakos University</strong>, passionate about MERN development and transitioning into penetration testing & cloud security.
            </h3>

            <div className="about-card glass">
              <h4><MdCode /> My Journey</h4>
              <p>
                I started by building fullstack apps with React, Node, and MongoDB. That curiosity led me down the rabbit hole of security. Now I’m focused on breaking and securing systems — deploying vulnerable apps like Juice Shop, practicing pentesting in Kubernetes, and learning how to build resilient infrastructures.
              </p>
            </div>

            <div className="skills-section">
              <h4><FaServer /> Core Skills</h4>
              <div className="skills-grid">
                {skillCategories.map((cat, i) => (
                  <div className="skill-category-card glass" key={i} style={{'--delay': `${i*0.1}s`}}>
                    <div className="cat-header"> {cat.icon} <span>{cat.title}</span> </div>
                    <div className="skill-badges">
                      {cat.skills.map((skill, j) => <span key={j} className="badge">{skill}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-card glass passion-card">
              <h4><MdCloud /> What Drives Me</h4>
              <p>
                I thrive on exploring new frameworks, containerized workflows, and security challenges. Whether it’s testing real-time WebSocket apps or automating security scans, I’m always building, breaking, and learning.
              </p>
            </div>

            <div className="about-card glass goals-card">
              <h4><FaBug /> What's Next</h4>
              <p>
                My goal is to specialize in cloud security and help organizations defend against modern threats. I’m currently sharpening my penetration testing skills and pursuing security certifications.
              </p>
            </div>

            <a href="#contact" className="btn-secondary">
              Let's Collaborate <i className='bx bx-chat'></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
export default About;