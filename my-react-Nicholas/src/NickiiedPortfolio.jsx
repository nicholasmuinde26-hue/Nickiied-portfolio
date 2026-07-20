import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import ProfessionalExperience from "./components/ProfessionalExperience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Services from './components/Services'

function NickiiedPortfolio({ content: contentFromProps, projects: initialProjects, loading: loadingFromProps }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  // Use props directly. Don't fetch again here
  const projects = initialProjects || [];
  const loading = loadingFromProps;

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
      subtitle: contentFromProps?.about?.subtitle || "",
      description: contentFromProps?.about?.description || "",
      skills: contentFromProps?.about?.skills || [],
      tools: contentFromProps?.about?.tools || [],
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
    services: contentFromProps?.services || [],
    experience: {
      stats: contentFromProps?.experience?.stats || [],
      items: contentFromProps?.experience?.items || []
    }
  };

  // REMOVED: useEffect that fetches projects again
  // We get everything from App.jsx now

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
      <ProfessionalExperience content={content} />
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