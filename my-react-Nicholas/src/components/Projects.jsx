import { useEffect } from "react";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const Projects = ({ projects, loading }) => {

  useEffect(() => {
    const cards = document.querySelectorAll('.project-card');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('show');
      })
    }, {threshold: 0.1});
    cards.forEach(card => obs.observe(card));
  }, [projects, loading])

  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="projects-header">
          <p className="section-tag">MY WORK</p>
          <h2 className="heading">Featured <span>Projects</span></h2>
          <p className="subheading">A collection of fullstack apps and security labs I've built</p>
        </div>

        <div className="projects-grid">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div className="project-card skeleton" key={i}>
                <div className="project-img skeleton-bg"></div>
                <div className="project-content">
                  <div className="skeleton-line skeleton-title"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line" style={{ width: '80%' }}></div>
                </div>
              </div>
            ))
          ) : (projects?.length === 0) ? (
            <div className="no-projects glass">
              <h3>No Projects Yet</h3>
              <p>Add your first project in the /admin dashboard</p>
            </div>
          ) : (
            projects.slice().sort((a, b) => (a.order || 0) - (b.order || 0)).map((p, index) => (
              <div className="project-card glass" key={p._id || index} style={{ '--delay': `${index * 0.15}s` }}>
                <div className="project-img">
                  <img src={p.image} alt={p.title} />
                  <div className="img-overlay"></div>
                </div>
                <div className="project-content">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="tech-stack">
                    {p.tech?.map((t) => <span key={t} className="badge">{t}</span>)}
                  </div>
                  <div className="project-links">
                    {p.link && 
                      <a href={p.link} target="_blank" rel="noopener noreferrer">
                        Live Demo <FaExternalLinkAlt />
                      </a>
                    }
                    {p.github && 
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn-outline">
                        Code <FaGithub />
                      </a>
                    }
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
export default Projects;