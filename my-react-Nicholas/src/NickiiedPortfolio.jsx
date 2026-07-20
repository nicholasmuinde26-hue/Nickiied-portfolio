import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import ProfessionalExperience from "./components/ProfessionalExperience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Services from './components/Services'

function NickiiedPortfolio({ content: contentFromProps, projects: initialProjects }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [projects, setProjects] = useState(initialProjects || []);
  const [loading, setLoading] = useState(!initialProjects);

  const API_URL = import.meta.env.VITE_API_URL || '';
  const ENV = import.meta.env;

  const content = {
    hero: {
      greeting: contentFromProps?.hero?.greeting || ENV.VITE_GREETING || "Hi, I'm",
      name: contentFromProps?.hero?.name || ENV.VITE_NAME || "Nickiied",
      bio: contentFromProps?.hero?.bio || ENV.VITE_QUOTE || "",
      ctaText: contentFromProps?.hero?.ctaText || ENV.VITE_CTA_TEXT || "View my work",
      roles: contentFromProps?.hero?.roles?.length > 0 ? contentFromProps.hero.roles : [ENV.VITE_ROLE_1, ENV.VITE_ROLE_2, ENV.VITE_ROLE_3, ENV.VITE_ROLE_4].filter(Boolean),
      profilePhoto: contentFromProps?.hero?.profilePhoto || ENV.VITE_PROFILE_PHOTO
    },
    about: {
      title: contentFromProps?.about?.title || "About Me",
      subtitle: contentFromProps?.about?.subtitle || "", // ADDED
      description: contentFromProps?.about?.description || "", // ADDED
      skills: contentFromProps?.about?.skills || [], // ADDED
      tools: contentFromProps?.about?.tools || [], // ADDED
      aboutPhoto: contentFromProps?.about?.aboutPhoto || ENV.VITE_ABOUT_PHOTO,
      cvLink: contentFromProps?.about?.cvLink || ENV.VITE_CV_LINK || "#"
    },
    nav: { logo: contentFromProps?.nav?.logo || ENV.VITE_LOGO },
    social: {
      github: contentFromProps?.social?.github || ENV.VITE_GITHUB,
      linkedin: contentFromProps?.social?.linkedin || ENV.VITE_LINKEDIN,
      tiktok: contentFromProps?.social?.tiktok || ENV.VITE_TIKTOK,
      email: contentFromProps?.social?.email || ENV.VITE_EMAIL
    },
    services: contentFromProps?.services || [], // ADDED THIS
    experience: { // ADDED THIS
      stats: contentFromProps?.experience?.stats || [],
      items: contentFromProps?.experience?.items || []
    }
  };

  useEffect(() => {
    if (initialProjects) return;
    const loadProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/projects`);
        if(!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProjects(Array.isArray(data)? data : []);
      } catch (err) { 
        console.error(err);
        setStatus('Could not load projects') 
      } finally { 
        setLoading(false) 
      }
    };
    loadProjects();
  }, [API_URL, initialProjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Message sent ✅');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setStatus(''), 3000)
      } else { setStatus(data.error || 'Failed to send'); }
    } catch { setStatus('Network error. Please try again'); }
  };

  return (
    <>
      <Navbar content={content} />
      <Hero content={content} />
      <About content={content} />
      <ProfessionalExperience content={content} /> {/* FIXED: pass content */}
      <Projects projects={projects} loading={loading} />
      <Services content={content} />
      <Contact 
        content={content}
        formData={formData} 
        setFormData={setFormData} 
        handleSubmit={handleSubmit} 
        status={status} 
      />
      <Footer content={content} />
    </>
  );
}

export default NickiiedPortfolio;