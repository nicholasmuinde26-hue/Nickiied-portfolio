import { FaCode, FaProjectDiagram, FaUsers, FaShieldAlt, FaLaptopCode, FaGraduationCap } from "react-icons/fa";
import { MdSecurity, MdWeb } from "react-icons/md";

const ProfessionalExperience = () => {

  const stats = [
    { number: "3+", label: "Years Learning", icon: <FaGraduationCap />, color: "#7cf03d" },
    { number: "12+", label: "Projects Built", icon: <FaProjectDiagram />, color: "#00d4ff" },
    { number: "100%", label: "Hands-on Labs", icon: <MdSecurity />, color: "#7cf03d" },
    { number: "99.9%", label: "Code Uptime", icon: <FaLaptopCode />, color: "#00d4ff" },
  ]

  const experiences = [
    {
      year: "2024 - Present",
      role: "Cybersecurity Student & MERN Developer",
      company: "Machakos University / Self-Learning",
      description: "Transitioning from fullstack development into cybersecurity. Practicing penetration testing, Kubernetes security, and cloud security. Building secure MERN applications with auth, WebSockets, and Docker.",
      tags: ["React", "Node.js", "MongoDB", "Nmap", "Kubernetes", "Docker"]
    },
    {
      year: "2023 - 2024",
      role: "Fullstack Web Developer",
      company: "Personal Projects & Freelance",
      description: "Built and deployed 10+ fullstack applications using the MERN stack. Focused on responsive design, REST APIs, and real-time features. Learned deployment with Docker and cloud hosting.",
      tags: ["React", "Express", "Tailwind", "WebSockets", "Git", "Postman"]
    },
    {
      year: "2022 - 2023",
      role: "Computer Science Student",
      company: "Machakos University",
      description: "Started Computer Science degree. Learned fundamentals of programming, data structures, networking, and Linux. Began exploring cybersecurity through CTFs and labs like Juice Shop.",
      tags: ["C++", "Java", "Linux", "Networking", "Git/GitHub"]
    }
  ]

  return (
    <section className="experience-v2" id="experience">
      <div className="container">
        <div className="experience-header">
          <p className="section-tag">PROFESSIONAL EXPERIENCE</p>
          <h2 className="heading">My <span>Journey</span></h2>
          <p className="subheading">A journey of continuous growth, from MERN development to cybersecurity specialization</p>
        </div>

        {/* STATS CARD */}
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div className="stat-card glass" key={i} style={{'--delay': `${i*0.1}s`}}>
              <div className="stat-icon" style={{color: stat.color}}>
                {stat.icon}
              </div>
              <h3 style={{color: stat.color}}>{stat.number}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* TIMELINE */}
        <div className="timeline">
          {experiences.map((exp, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-dot"></div>
              <div className="timeline-content glass">
                <span className="timeline-year">{exp.year}</span>
                <h3>{exp.role}</h3>
                <h4>{exp.company}</h4>
                <p>{exp.description}</p>
                <div className="timeline-tags">
                  {exp.tags.map((tag, j) => <span key={j} className="badge">{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default ProfessionalExperience;