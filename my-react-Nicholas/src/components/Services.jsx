import { FaCode, FaMobileAlt, FaPaintBrush, FaRocket, FaCheck } from 'react-icons/fa';

function Services({ content }) {
  const services = [
    {
      icon: <FaCode />,
      title: "Website Development",
      desc: "Custom, fast, and responsive websites built to convert visitors into clients.",
      features: [
        "React / Next.js / Vite",
        "SEO Optimized + Fast Loading",
        "Mobile First Responsive",
        "Contact Form + Analytics"
      ],
      tag: "Most Popular"
    },
    {
      icon: <FaMobileAlt />,
      title: "Web App Development", 
      desc: "Full-stack web applications with dashboards, auth, and databases.",
      features: [
        "MERN / Node.js / Firebase",
        "User Auth + Admin Panel",
        "Payment Integration",
        "Deployment + Maintenance"
      ],
      tag: null
    },
    {
      icon: <FaPaintBrush />,
      title: "UI/UX & Branding",
      desc: "Modern designs that make your brand stand out and feel premium.",
      features: [
        "Figma to Code",
        "Brand Identity Kit",
        "Landing Page Design",
        "3 Revisions Included"
      ],
      tag: null
    },
    {
      icon: <FaRocket />,
      title: "Portfolio / Personal Brand",
      desc: "Showcase your work like a pro. Perfect for freelancers and creators.",
      features: [
        "Custom Portfolio Website",
        "Blog + Project Showcase", 
        "Admin Panel to Edit Content",
        "Chat Widget + WhatsApp Integration"
      ],
      tag: "New"
    }
  ]

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="reveal" data-delay="1">
          <h2 className="section-title">Services I Offer</h2>
          <p className="section-subtitle">Custom solutions tailored to your goals. No templates, no fluff.</p>
        </div>
        
        <div className="services-grid">
          {services.map((service, i) => (
            <div key={i} className="service-card reveal" data-delay={i+2}>
              {service.tag && <span className="service-tag">{service.tag}</span>}
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              
              <ul className="service-features">
                {service.features.map((f, j) => (
                  <li key={j} className="reveal" data-delay={j+6}><FaCheck /> {f}</li>
                ))}
              </ul>

              <a href="#contact" className="service-cta">
                Get a Quote
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services