import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

//.ENV FALLBACKS
const defaultContent = {
  hero: {
    greeting: "Hello, I'm",
    name: import.meta.env.VITE_HERO_NAME || "Nicholas Muinde Mwanza",
    roles: import.meta.env.VITE_HERO_ROLES? import.meta.env.VITE_HERO_ROLES.split(',') : ["Fullstack Developer", "Cybersecurity Student"],
    bio: import.meta.env.VITE_HERO_BIO || "Building secure web apps with MERN.",
    ctaText: import.meta.env.VITE_HERO_CTA || "View My Work",
    profilePhoto: import.meta.env.VITE_PROFILE_PHOTO || "/images/profilePhoto.jpg",
  },
  about: {
    subtitle: import.meta.env.VITE_ABOUT_SUBTITLE || "DEVELOPER & CYBERSECURITY SPECIALIST",
    title: import.meta.env.VITE_ABOUT_TITLE || "Building Secure",
    aboutPhoto: import.meta.env.VITE_ABOUT_PHOTO || "/images/projPorfolioe.jpeg",
    cvLink: import.meta.env.VITE_CV_LINK || "/cv.pdf",
    aboutHeadline: import.meta.env.VITE_ABOUT_HEADLINE || "I'm Nicholas Muinde Mwanza — a Computer Science student at <strong>Machakos University</strong>, passionate about MERN development and transitioning into penetration testing & cloud security.",
    description: import.meta.env.VITE_ABOUT_JOURNEY || "I started by building fullstack apps with React, Node, and MongoDB.",
    drivesMe: import.meta.env.VITE_ABOUT_DRIVESME || "I thrive on exploring new frameworks.",
    goals: import.meta.env.VITE_ABOUT_GOALS || "My goal is to specialize in cloud security.",
    skills: [
      { title: "Frontend", icon: "FaReact", skills: ["React", "Tailwind CSS"] },
      { title: "Backend", icon: "FaNodeJs", skills: ["Node.js", "Express"] },
    ]
  },
  experience: { stats: [], items: [] },
  services: [],
  social: { github: "", linkedin: "", tiktok: "", email: "" },
  nav: { logo: "" },
}

const inputStyle = {width:'100%', padding:'12px', margin:'8px 0 16px 0', background:'#222', border:'1px solid #333', color:'#fff', borderRadius:8}
const btnStyle = {padding:12, background:'#7cf03d', border:'none', borderRadius:8, fontWeight:700, color:'#000', cursor:'pointer'}

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [content, setContent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tab, setTab] = useState("hero");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const hasFetched = useRef(false);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const login = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${API}/api/auth/login`, {email: e.target.email.value, password: e.target.password.value});
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setContent(null);
    hasFetched.current = false;
  }

  // LOAD: DB +.ENV FALLBACK - same as Hero
  useEffect(() => {
    if (!token || hasFetched.current) return;
    hasFetched.current = true;
    setLoading(true);
    Promise.all([
      axios.get(`${API}/api/content`, authHeader).catch(() => ({data: {}})),
      axios.get(`${API}/api/projects`, authHeader).catch(() => ({data: []}))
    ]).then(([c, p]) => {
      const dbData = c.data || {};
      const merged = {
     ...defaultContent,
     ...dbData,
        hero: {...defaultContent.hero,...dbData.hero},
        about: {...defaultContent.about,...dbData.about},
        experience: {...defaultContent.experience,...dbData.experience},
        social: {...defaultContent.social,...dbData.social},
        nav: {...defaultContent.nav,...dbData.nav},
        services: dbData.services || defaultContent.services,
      }
      setContent(merged);
      setProjects(p.data || [])
    })
.catch(() => logout())
.finally(() => setLoading(false));
  }, [token])

const saveContent = async () => {
  setSaving(true);
  try {
    // Force send clean object
    const payload = JSON.parse(JSON.stringify(content));
    const res = await axios.put(`${API}/api/content`, payload, authHeader);
    setContent(res.data);
    alert("Saved ✅");
  } catch(err) {
    console.error("FULL ERROR:", err.response?.data);
    alert("Save Failed: " + (err.response?.data?.message || err.message))
  }
  setSaving(false);
}

  const update = (section, field, value) => {
    setContent(prev => ({...prev, [section]: {...prev[section], [field]: value }}))
  }

  if (!token) return (
    <div style={{background:'#0a0a0a', color:'#fff', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <form onSubmit={login} style={{width:'400px', padding:'40px', background:'#111', border:'1px solid #7cf03d', borderRadius:12}}>
        <h2 style={{textAlign:'center'}}>Admin <span style={{color:'#7cf03d'}}>Login</span></h2>
        <input name="email" type="email" placeholder="Email" style={inputStyle} />
        <input name="password" type="password" placeholder="Password" style={inputStyle} />
        <button style={{...btnStyle, width:'100%'}}>Login</button>
      </form>
    </div>
  );

  if (loading ||!content) return <div style={{padding:40}}>Loading...</div>

  return (
    <div style={{background:'#0a0a0a', color:'#fff', minHeight:'100vh', padding:40}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
        <h1 style={{color:'#7cf03d'}}>Dashboard</h1>
        <button onClick={logout} style={{...btnStyle, background:'red', color:'#fff'}}>Logout</button>
      </div>

      <div style={{display:'flex', gap:10, marginBottom:20, flexWrap:'wrap'}}>
        {["hero","about","experience","services","projects","social"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{...btnStyle, background: tab===t? '#7cf03d' : '#222', color: tab===t? '#000' : '#7cf03d', textTransform:'capitalize'}}>{t}</button>
        ))}
      </div>

      {content && (
        <div style={{background:'#111', padding:30, borderRadius:12, maxWidth:900}}>

          {/* HERO TAB */}
          {tab === "hero" && (
            <>
              <h2>Hero Section</h2>
              <label>Greeting</label><input value={content.hero.greeting || ''} onChange={e => update('hero','greeting', e.target.value)} style={inputStyle} />
              <label>Name</label><input value={content.hero.name || ''} onChange={e => update('hero','name', e.target.value)} style={inputStyle} />
              <label>Roles - comma separated</label><input value={content.hero.roles?.join(', ') || ''} onChange={e => update('hero','roles', e.target.value.split(',').map(s=>s.trim()))} style={inputStyle} />
              <label>Bio HTML</label><textarea rows="4" value={content.hero.bio || ''} onChange={e => update('hero','bio', e.target.value)} style={inputStyle} />
              <label>CTA Text</label><input value={content.hero.ctaText || ''} onChange={e => update('hero','ctaText', e.target.value)} style={inputStyle} />
              <label>Profile Photo URL</label><input value={content.hero.profilePhoto || ''} onChange={e => update('hero','profilePhoto', e.target.value)} style={inputStyle} />
            </>
          )}

          {/* ABOUT TAB - FIXED */}
          {tab === "about" && (
            <>
              <h2>About Section</h2>
              <label>Subtitle</label><input value={content.about.subtitle || ''} onChange={e => update('about','subtitle', e.target.value)} style={inputStyle} />
              <label>Title</label><input value={content.about.title || ''} onChange={e => update('about','title', e.target.value)} style={inputStyle} />
              <label>Headline HTML</label><textarea rows="3" value={content.about.aboutHeadline || ''} onChange={e => update('about','aboutHeadline', e.target.value)} style={inputStyle} />
              <label>Journey / Description HTML</label><textarea rows="4" value={content.about.description || ''} onChange={e => update('about','description', e.target.value)} style={inputStyle} />
              <label>What Drives Me</label><textarea rows="3" value={content.about.drivesMe || ''} onChange={e => update('about','drivesMe', e.target.value)} style={inputStyle} />
              <label>What's Next / Goals</label><textarea rows="3" value={content.about.goals || ''} onChange={e => update('about','goals', e.target.value)} style={inputStyle} />
              <label>About Photo URL</label><input value={content.about.aboutPhoto || ''} onChange={e => update('about','aboutPhoto', e.target.value)} style={inputStyle} />
              <label>CV Link</label><input value={content.about.cvLink || ''} onChange={e => update('about','cvLink', e.target.value)} style={inputStyle} />

              <h3 style={{color:'#7cf03d', marginTop:30}}>Skills Categories</h3>
              {content.about.skills?.map((cat,i) => (
                <div key={i} style={{background:'#222', padding:15, marginBottom:15, borderRadius:8}}>
                  <label>Category Title</label>
                  <input value={cat.title || ''} onChange={e => {const arr=[...content.about.skills]; arr[i].title=e.target.value; update('about','skills',arr)}} style={inputStyle} />
                  <label>Icon Name</label>
                  <input placeholder="FaReact, FaNodeJs, FaShieldAlt, BsTerminal" value={cat.icon || ''} onChange={e => {const arr=[...content.about.skills]; arr[i].icon=e.target.value; update('about','skills',arr)}} style={inputStyle} />
                  <label>Skills - comma separated</label>
                  <input value={cat.skills?.join(', ') || ''} onChange={e => {const arr=[...content.about.skills]; arr[i].skills=e.target.value.split(',').map(s=>s.trim()); update('about','skills',arr)}} style={inputStyle} />
                  <button onClick={() => update('about','skills', content.about.skills.filter((_,idx)=>idx!==i))} style={{background:'red', color:'#fff', padding:'8px 15px', border:'none', borderRadius:5}}>Delete Category</button>
                </div>
              ))}
              <button onClick={() => update('about','skills', [...(content.about.skills||[]), {title:'', icon:'FaCode', skills:[]}])} style={{...btnStyle, background:'#333', color:'#7cf03d', marginBottom:20}}>+ Add Skill Category</button>
            </>
          )}

          {/* EXPERIENCE TAB */}
          {tab === "experience" && (
            <>
              <h2>Experience Section</h2>
              <h3 style={{color:'#7cf03d', marginTop:20}}>Stats Cards</h3>
              {content.experience?.stats?.map((stat,i) => (
                <div key={i} style={{background:'#222', padding:15, marginBottom:15, borderRadius:8}}>
                  <label>Number</label><input placeholder="3+" value={stat.number || ''} onChange={e => {const arr=[...content.experience.stats]; arr[i].number=e.target.value; update('experience','stats',arr)}} style={inputStyle} />
                  <label>Label</label><input placeholder="Years Learning" value={stat.label || ''} onChange={e => {const arr=[...content.experience.stats]; arr[i].label=e.target.value; update('experience','stats',arr)}} style={inputStyle} />
                  <label>Icon Name</label><input placeholder="FaGraduationCap" value={stat.icon || ''} onChange={e => {const arr=[...content.experience.stats]; arr[i].icon=e.target.value; update('experience','stats',arr)}} style={inputStyle} />
                  <label>Color Hex</label><input placeholder="#7cf03d" value={stat.color || ''} onChange={e => {const arr=[...content.experience.stats]; arr[i].color=e.target.value; update('experience','stats',arr)}} style={inputStyle} />
                  <button onClick={() => update('experience','stats', content.experience.stats.filter((_,idx)=>idx!==i))} style={{background:'red', color:'#fff', padding:'8px 15px', border:'none', borderRadius:5}}>Delete Stat</button>
                </div>
              ))}
              <button onClick={() => update('experience','stats', [...(content.experience.stats||[]), {number:'',label:'',icon:'FaCode',color:'#7cf03d'}])} style={{...btnStyle, background:'#333', color:'#7cf03d', marginBottom:30}}>+ Add Stat</button>

              <h3 style={{color:'#7cf03d'}}>Timeline</h3>
              {content.experience?.items?.map((exp,i) => (
                <div key={i} style={{background:'#222', padding:15, marginBottom:15, borderRadius:8}}>
                  <input placeholder="Year" value={exp.year || ''} onChange={e => {const arr=[...content.experience.items]; arr[i].year=e.target.value; update('experience','items',arr)}} style={inputStyle} />
                  <input placeholder="Role" value={exp.role || ''} onChange={e => {const arr=[...content.experience.items]; arr[i].role=e.target.value; update('experience','items',arr)}} style={inputStyle} />
                  <input placeholder="Company" value={exp.company || ''} onChange={e => {const arr=[...content.experience.items]; arr[i].company=e.target.value; update('experience','items',arr)}} style={inputStyle} />
                  <textarea placeholder="Description" rows="3" value={exp.description || ''} onChange={e => {const arr=[...content.experience.items]; arr[i].description=e.target.value; update('experience','items',arr)}} style={inputStyle} />
                  <input placeholder="Tags - comma separated" value={exp.tags?.join(', ') || ''} onChange={e => {const arr=[...content.experience.items]; arr[i].tags=e.target.value.split(',').map(s=>s.trim()); update('experience','items',arr)}} style={inputStyle} />
                  <button onClick={() => update('experience','items', content.experience.items.filter((_,idx)=>idx!==i))} style={{background:'red', color:'#fff', padding:'8px 15px', border:'none', borderRadius:5}}>Delete</button>
                </div>
              ))}
              <button onClick={() => update('experience','items', [...(content.experience.items||[]), {year:'',role:'',company:'',description:'',tags:[]}])} style={{...btnStyle, background:'#333', color:'#7cf03d'}}>+ Add Experience</button>
            </>
          )}

          {/* SERVICES TAB */}
          {tab === "services" && (
            <>
              <h2>Services</h2>
              {content.services?.map((s,i) => (
                <div key={i} style={{background:'#222', padding:15, marginBottom:15, borderRadius:8}}>
                  <input placeholder="Title" value={s.title || ''} onChange={e => {const arr=[...content.services]; arr[i].title=e.target.value; update('services','',arr)}} style={inputStyle} />
                  <textarea placeholder="Description" rows="3" value={s.desc || ''} onChange={e => {const arr=[...content.services]; arr[i].desc=e.target.value; update('services','',arr)}} style={inputStyle} />
                  <input placeholder="Tag" value={s.tag || ''} onChange={e => {const arr=[...content.services]; arr[i].tag=e.target.value; update('services','',arr)}} style={inputStyle} />
                  <input placeholder="Features - comma separated" value={s.features?.join(', ') || ''} onChange={e => {const arr=[...content.services]; arr[i].features=e.target.value.split(',').map(s=>s.trim()); update('services','',arr)}} style={inputStyle} />
                  <button onClick={() => update('services','', content.services.filter((_,idx)=>idx!==i))} style={{background:'red', color:'#fff', padding:'8px 15px', border:'none', borderRadius:5}}>Delete</button>
                </div>
              ))}
              <button onClick={() => update('services','', [...(content.services||[]), {title:'',desc:'',tag:'',features:[]}])} style={{...btnStyle, background:'#333', color:'#7cf03d'}}>+ Add Service</button>
            </>
          )}

          {/* SOCIAL TAB */}
          {tab === "social" && (
            <>
              <h2>Social Links</h2>
              <label>Github</label><input value={content.social.github || ''} onChange={e => update('social','github', e.target.value)} style={inputStyle} />
              <label>LinkedIn</label><input value={content.social.linkedin || ''} onChange={e => update('social','linkedin', e.target.value)} style={inputStyle} />
              <label>Tiktok</label><input value={content.social.tiktok || ''} onChange={e => update('social','tiktok', e.target.value)} style={inputStyle} />
              <label>Email</label><input value={content.social.email || ''} onChange={e => update('social','email', e.target.value)} style={inputStyle} />
            </>
          )}

          <button onClick={saveContent} disabled={saving} style={{...btnStyle, width:'100%', marginTop:20}}>
            {saving? 'Saving...' : 'Save All Content'}
          </button>
        </div>
      )}
    </div>
  )
}