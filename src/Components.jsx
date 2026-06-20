import { useState } from "react";
import profilePhoto from './assets/profilePhoto.jpg'
import tech from './assets/tech.jpeg'
import projPorfolio from './assets/projPorfolio.jpeg'
import projPorfolio2 from './assets/projPorfolio2.jpeg'
import projPorfolio3 from './assets/projPorfolio3.jpeg'
import projPorfolio4 from './assets/projPorfolio4.jpeg'
import projPorfolio5 from './assets/projPorfolio5.jpg'
import projPorfolio6 from './assets/projPorfolio6.jpg'


function NickiiedPortfolio() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="nav-bar">
        <h1 className="logo">Nickiied</h1>
        

<button className={`hamburger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
  <span></span>
  <span></span>
  <span></span>
</button>



        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li><a href="#home" onClick={() => setIsOpen(false)}>Home</a></li>
          <li><a href="#about" onClick={() => setIsOpen(false)}>About Me</a></li>
          <li><a href="#projects" onClick={() => setIsOpen(false)}>Projects</a></li>
          <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>
        </ul>
         {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
         
      </nav>
      
    

      <section id="home" className="hero" >
      <div className="home-info">
          <p className="hero-greeting">Hi, I'm Nickiied</p>

      <h2>I'm a&nbsp;   
        <span style={{'--i': 4}} data-text="Frontend Developer">Frontend Developer</span>
        <span style={{'--i': 3}} data-text="Security Specialist">Security Specialist</span>
        <span style={{'--i': 2}} data-text="Backend Developer">Backend Developer</span>
        <span style={{'--i': 1}} data-text="Fullstack Developer">Fullstack Developer</span>
      </h2>
      <p>
    Turning ideas into secure, intelligent digital realities.  
    I craft responsive web apps, explore cybersecurity challenges, and experiment with AI to push boundaries.  
    Driven by curiosity and collaboration, I blend clean code with bold design to deliver experiences that stand out.
  </p>
    
    <div className="hero-cta">
<div className="cta-btn">
        <a href="#projects"  className="cta-btn">View my work</a>
</div>
        <div className="social-icons">
  <a href="https://github.com/nicholasmuinde26-hue" target="_blank"><i className='bx bxl-github'></i></a>
  <a href="https://www.linkedin.com/in/nicholas-mwanza-3766513aa?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank"><i className='bx bxl-linkedin-square'></i></a>
  <a href="https://www.tiktok.com/@user_nickiee_d?_r=1&_t=ZS-97Lg26vn8sP" target="_blank"><i class='bx bxl-tiktok'></i></a>
  <a href="mailto:nicholasmuinde26@gmail.com"><i className='bx bxl-gmail'></i></a>
</div>
    </div>
      
       
      </div>

      <div className="hero-img">
      <div className="img-box">
      <div className="img-item">
      <img src={profilePhoto} alt="NickiiedPhoto"></img>
      </div> 
      </div> 
      </div>


      </section>
      

<section className="about" id="about"> 
 <div className="about-img">
  <div className="img-box">
   <img src={tech} alt="NickiiedPhoto"></img>

  </div>
 </div>

      <div className="about-content">
  <h2 className="heading">About <span>Me</span></h2>
  <h3>Backend Developer & Security Enthusiast</h3>
  <p>
    I'm a fullstack developer from Machakos, KE with a passion for building secure, 
    scalable web apps. I blend clean backend architecture with bold frontend design. 
    <br /><br />
    When I’m not coding, I’m exploring cybersecurity challenges, experimenting with AI, 
    and learning new tech stacks. My goal: turn ideas into digital realities that actually 
    work and look good doing it.
  </p>
<div className="skills">
  <div className="skill-bar">
    <div className="skill-info">
      <i className="devicon-python-plain"></i>
      <span>Python / Django</span>
    </div>
    <div className="skill-progress">
      <div className="skill-fill" data-percent="90%"></div>
    </div>
  </div>

  <div className="skill-bar">
    <div className="skill-info">
      <i className="devicon-docker-plain"></i>
      <span>Docker</span>
    </div>
    <div className="skill-progress">
      <div className="skill-fill" data-percent="85%"></div>
    </div>
  </div>

  <div className="skill-bar">
    <div className="skill-info">
      <i className="devicon-amazonwebservices-plain-wordmark"></i>
      <span>AWS</span>
    </div>
    <div className="skill-progress">
      <div className="skill-fill" data-percent="80%"></div>
    </div>
  </div>

  <div className="skill-bar">
    <div className="skill-info">
      <i className="devicon-nodejs-plain"></i>
      <span>Node.js / Express</span>
    </div>
    <div className="skill-progress">
      <div className="skill-fill" data-percent="85%"></div>
    </div>
  </div>
</div>
<div className="tools-grid">
  <div className="tool-item" style={{'--delay': '0.1s'}}>
    <i className="devicon-git-plain"></i>
    <span>Git</span>
  </div>
  
  <div className="tool-item" style={{'--delay': '0.2s'}}>
    <i className="devicon-linux-plain"></i>
    <span>Linux</span>
  </div>
  
  <div className="tool-item" style={{'--delay': '0.3s'}}>
    <i className="devicon-postgresql-plain"></i>
    <span>PostgreSQL</span>
  </div>
  
  <div className="tool-item" style={{'--delay': '0.4s'}}>
    <i className="devicon-vscode-plain"></i>
    <span>VS Code</span>
  </div>
  
  <div className="tool-item" style={{'--delay': '0.5s'}}>
    <i className="devicon-postman-plain"></i>
    <span>Postman</span>
  </div>
  
  <div className="tool-item" style={{'--delay': '0.6s'}}>
    <i className="devicon-kubernetes-plain"></i>
    <span>K8s</span>
  </div>
</div>
  <a href="#contact" className="btn">Let's Talk</a>
</div>
</section>


<section className="projects" id="projects">
  <h2 className="heading">My <span>Projects</span></h2>
  
  <div className="projects-grid">
    <div className="project-card">
      <div className="project-img">
        <img src={projPorfolio2} alt="SecureChat App" />
      </div>
      <div className="project-content">
        <h3>SecureChat App</h3>
        <p>End-to-end encrypted chat with React + Node.js + WebSockets</p>
        <div className="tech-stack">
          <span>React</span><span>Node.js</span><span>Socket.io</span><span>Coming soon...</span>
        </div>
        <div className="project-links">
          <a href="#" target="_blank">Live Demo</a>
          <a href="#" target="_blank">GitHub</a>
        </div>
      </div>
    </div>

    <div className="project-card">
      <div className="project-img">
        <img src={projPorfolio6} alt="AI Scanner" />
      </div>
      <div className="project-content">
        <h3>AI Vulnerability Scanner</h3>
        <p>Python tool that detects OWASP top 10 flaws automatically</p>
        <div className="tech-stack">
          <span>Python</span><span>FastAPI</span><span>ML</span><span>Coming soon...</span>
        </div>
        <div className="project-links">
          <a href="#" target="_blank">Live Demo</a>
          <a href="#" target="_blank">GitHub</a>
        </div>
      </div>
    </div>
    <div className="project-card">
  <div className="project-img">
    <img src={projPorfolio3} alt="Tic-Tac-Toe Game" />
  </div>
  <div className="project-content">
    <h3>Tic-Tac-Toe</h3>
    <p>Interactive 2-player game with win detection + reset logic built in vanilla JS</p>
    <div className="tech-stack">
      <span>JavaScript</span><span>HTML5</span><span>CSS3</span>
    </div>
    <div className="project-links">
      <a href="#" target="_blank">Live Demo</a>
      <a href="#" target="_blank">GitHub</a>
    </div>
  </div>
</div>

<div className="project-card">
  <div className="project-img">
    <img src={projPorfolio4} alt="Event RSVP Form" />
  </div>
  <div className="project-content">
    <h3>Event RSVP Form</h3>
    <p>Responsive RSVP form with guest count, dietary prefs + validation. Clean UI/UX</p>
    <div className="tech-stack">
      <span>React</span><span>Tailwind</span><span>Form Validation</span>
    </div>
    <div className="project-links">
      <a href="#" target="_blank">Live Demo</a>
      <a href="#" target="_blank">GitHub</a>
    </div>
  </div>
</div>

<div className="project-card">
  <div className="project-img">
    <img src={projPorfolio5} alt="Cyber Security Scanner" />
  </div>
  <div className="project-content">
    <h3>OWASP Vulnerability Scanner</h3>
    <p>Python + FastAPI tool that scans websites for OWASP Top 10 flaws and generates security reports</p>
    <div className="tech-stack">
      <span>Python</span><span>FastAPI</span><span>OWASP</span><span>Docker</span><span>Coming soon...</span>
    </div>
    <div className="project-links">
      <a href="#" target="_blank">Live Demo</a>
      <a href="#" target="_blank">GitHub</a>
    </div>
  </div>
</div>

    <div className="project-card">
      <div className="project-img">
        <img src={projPorfolio} alt="Portfolio" />
      </div>
      <div className="project-content">
        <h3>This Portfolio</h3>
        <p>Animated portfolio with typewriter + glassmorphism UI</p>
        <div className="tech-stack">
          <span>React</span><span>CSS3</span><span>Framer Motion</span>
        </div>
        <div className="project-links">
          <a href="#">Live Demo</a>
          <a href="#" target="_blank">GitHub</a>
        </div>
      </div>
    </div>
  </div>
</section>

      <section className="contact" id="contact">
  <h2 className="heading">Contact <span>Me</span></h2>
  
  <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
    <div className="input-box">
      <input type="text" placeholder="Full Name" required />
      <input type="email" placeholder="Email Address" required />
    </div>
    
    <div className="input-box">
      <input type="tel" placeholder="Phone Number" />
      <input type="text" placeholder="Subject" required />
    </div>
    
    <textarea placeholder="Your Message" rows="6" required></textarea>
    
    <button type="submit" className="btn">Send Message</button>
  </form>
</section>
<footer className="footer">
  <div className="footer-content">
    <div className="footer-text">
      <p>© 2026 Nickiied. All rights reserved.</p>
    </div>
    
    <div className="social-icons">
      <a href="https://github.com/nicholasmuinde26-hue" target="_blank"><i className='bx bxl-github'></i></a>
      <a href="https://www.linkedin.com/in/nicholas-mwanza-3766513aa?utm_source=share_via&utm_content=profile&utm_medium=member_android"><i className='bx bxl-linkedin'></i></a>
      <a href="https://www.tiktok.com/@user_nickiee_d?_r=1&_t=ZS-97Lg26vn8sP" target="_blank"><i class='bx bxl-tiktok'></i></a>
      <a href="mailto:nicholasmuinde26@gmail.com"><i className='bx bxl-gmail'></i></a>
    </div>
    
    <a href="#home" className="back-to-top"><i className='bx bx-up-arrow-alt'></i></a>
  </div>
</footer>

    </>
  );
}

export default NickiiedPortfolio