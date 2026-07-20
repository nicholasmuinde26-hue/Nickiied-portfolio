import { FaReact, FaNodeJs, FaServer, FaShieldAlt, FaBug, FaArrowRight, FaDownload } from "react-icons/fa";
import { MdCode, MdCloud } from "react-icons/md";
import { BsTerminal } from "react-icons/bs";

const iconMap = { FaReact, FaNodeJs, FaServer, FaShieldAlt, BsTerminal, MdCode, MdCloud, FaBug };

const About = ({ content }) => {

  // FALLBACKS
  const about = {
    subtitle: content?.about?.subtitle || import.meta.env.VITE_ABOUT_SUBTITLE || "DEVELOPER & CYBERSECURITY SPECIALIST",
    title: content?.about?.title || import.meta.env.VITE_ABOUT_TITLE || "Building Secure",
    aboutPhoto: content?.about?.aboutPhoto || import.meta.env.VITE_ABOUT_PHOTO || "/images/projPorfolioe.jpeg",
    cvLink: content?.about?.cvLink || import.meta.env.VITE_CV_LINK || "/cv.pdf",
    aboutHeadline: content?.about?.aboutHeadline || import.meta.env.VITE_ABOUT_HEADLINE || "I'm Nicholas Muinde Mwanza — a Computer Science student at <strong>Machakos University</strong>, passionate about MERN development and transitioning into penetration testing & cloud security.",
    description: content?.about?.description || import.meta.env.VITE_ABOUT_JOURNEY || "I started by building fullstack apps with React, Node, and MongoDB. That curiosity led me down the rabbit hole of security.",
    drivesMe: content?.about?.drivesMe || import.meta.env.VITE_ABOUT_DRIVESME || "I thrive on exploring new frameworks, containerized workflows, and security challenges.",
    goals: content?.about?.goals || import.meta.env.VITE_ABOUT_GOALS || "My goal is to specialize in cloud security and help organizations defend against modern threats.",
    skills: content?.about?.skills?.length > 0? content.about.skills : [
      { title: "Frontend", icon: "FaReact", skills: ["React", "Tailwind CSS", "TypeScript", "Responsive Design"] },
      { title: "Backend", icon: "FaNodeJs", skills: ["Node.js", "Express", "MongoDB", "REST APIs"] },
      { title: "Cybersecurity", icon: "FaShieldAlt", skills: ["Nmap", "Kubernetes", "Cloud Security", "Burp Suite"] },
      { title: "Tools", icon: "BsTerminal", skills: ["Git/GitHub", "Docker", "Linux", "Postman"] },
    ]
  }

  const heroName = content?.hero?.name || import.meta.env.VITE_HERO_NAME || "Nicholas Muinde Mwanza";

  return (
    <section className="about-v2" id="about">
      <div className="container">
        <div className="about-header reveal" data-delay="1">
          <p className="section-tag">{about.subtitle}</p>
          <h2 className="heading">{about.title} <span>Digital Solutions</span></h2>
        </div>

        <div className="about-grid">
          <div className="about-left reveal" data-delay="2">
            <div className="photo-card">
              <div className="glow-border"></div>
              <img src={about.aboutPhoto} alt={heroName} />
            </div>
            <div className="left-ctas reveal" data-delay="3">
              <a href="#projects" className="btn-primary">View My Projects <FaArrowRight /></a>
              <a href={about.cvLink} target="_blank" rel="noopener noreferrer" className="btn-outline">Download CV <FaDownload /></a>
            </div>
          </div>

          <div className="about-right">
            <h3 className="about-headline reveal" data-delay="3" dangerouslySetInnerHTML={{__html: about.aboutHeadline}} />

            <div className="about-card glass reveal" data-delay="4">
              <h4><MdCode /> My Journey</h4>
              <p dangerouslySetInnerHTML={{__html: about.description}} />
            </div>

            <div className="skills-section reveal" data-delay="5">
              <h4><FaServer /> Core Skills</h4>
              <div className="skills-grid">
                {about.skills?.map((cat, i) => {
                  const Icon = iconMap[cat.icon] || FaServer;
                  return (
                    <div className="skill-category-card glass reveal" data-delay={i+6} key={i}>
                      <div className="cat-header"> <Icon /> <span>{cat.title}</span> </div>
                      <div className="skill-badges">
                        {cat.skills?.map((skill, j) => <span key={j} className="badge reveal" data-delay={j+10}>{skill}</span>)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="about-card glass passion-card reveal" data-delay="9">
              <h4><MdCloud /> What Drives Me</h4>
              <p dangerouslySetInnerHTML={{__html: about.drivesMe}} />
            </div>

            <div className="about-card glass goals-card reveal" data-delay="10">
              <h4><FaBug /> What's Next</h4>
              <p dangerouslySetInnerHTML={{__html: about.goals}} />
            </div>

            <a href="#contact" className="btn-secondary reveal" data-delay="11">Let's Collaborate <i className='bx bx-chat'></i></a>
          </div>
        </div>
      </div>
    </section>
  )
}
export default About;