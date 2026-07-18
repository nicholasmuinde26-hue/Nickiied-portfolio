import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FiTrash2, FiEdit, FiLogOut, FiLoader, FiPlus, FiX, FiUpload } from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [content, setContent] = useState({
    hero: { name: "", bio: "", ctaText: "", greeting: "Hi, I'm", roles: ["", "", ""], profilePhoto: "" },
    about: { title: "", description: "", skills: [], tools: [], aboutPhoto: "", subtitle: "" },
    nav: { logo: "" },
    social: { github: "", linkedin: "", tiktok: "", email: "" },
    services: [],
  });
  const [projects, setProjects] = useState([]);
  const [tab, setTab] = useState("hero");
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getAuthHeader = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { headers: getAuthHeader() };
      const [contentRes, projectsRes] = await Promise.all([
        axios.get(`${API}/api/content`, headers),
        axios.get(`${API}/api/projects`, headers)
      ]);

      const db = contentRes.data || {};
      setContent(prev => ({
      ...prev,
      ...db,
        hero: {...prev.hero,...db.hero, roles: db.hero?.roles || prev.hero.roles },
        about: {...prev.about,...db.about, skills: db.about?.skills || [], tools: db.about?.tools || [] },
        nav: {...prev.nav,...db.nav },
        social: {...prev.social,...db.social },
        services: db.services || [],
      }));
      setProjects(projectsRes.data || []);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  useEffect(() => { if (token) fetchData(); else setLoading(false); }, [token, fetchData]);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email: e.target.email.value, password: e.target.password.value });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch {
      alert("Login failed")
    }
  };

  // NEW: Upload handler
  const handleUpload = async (e, path) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(`${API}/api/upload`, formData, { headers: {...getAuthHeader(), "Content-Type": "multipart/form-data" } });
      const keys = path.split('.');
      setContent(prev => {
        const newContent = structuredClone(prev);
        newContent[keys[0]][keys[1]] = res.data.url;
        return newContent;
      });
    } catch { alert("Upload failed") } finally { setUploading(false) }
  };

  const saveContent = async () => {
    setSaving(true);
    await axios.put(`${API}/api/content`, content, { headers: getAuthHeader() });
    setSaving(false);
    alert("Saved ✅");
  };

  const saveProjects = async (projectList) => {
    await axios.put(`${API}/api/projects`, projectList, { headers: getAuthHeader() });
    alert("Projects Saved ✅");
  };

  const updateArrayItem = (path, index, value) => {
    const keys = path.split('.');
    setContent(prev => {
      const newContent = structuredClone(prev);
      newContent[keys[0]][keys[1]][index] = value;
      return newContent;
    });
  };

  const addArrayItem = (path, defaultVal = "") => {
    const keys = path.split('.');
    setContent(prev => {
      const newContent = structuredClone(prev);
      newContent[keys[0]][keys[1]].push(defaultVal);
      return newContent;
    });
  };

  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    setContent(prev => {
      const newContent = structuredClone(prev);
      newContent[keys[0]][keys[1]].splice(index, 1);
      return newContent;
    });
  }

  // PROJECT CRUD
  const addProject = () => {
    setEditingProject({ title: "", description: "", image: "", link: "", github: "", tech: [""] });
  };
  const saveProject = () => {
    const list = editingProject._id? projects.map(p => p._id === editingProject._id? editingProject : p) : [...projects, {...editingProject, _id: Date.now()}];
    setProjects(list);
    saveProjects(list);
    setEditingProject(null);
  };
  const deleteProject = (id) => {
    const list = projects.filter(p => p._id!== id);
    setProjects(list);
    saveProjects(list);
  };
  const handleProjectUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${API}/api/upload`, formData, { headers: {...getAuthHeader(), "Content-Type": "multipart/form-data" } });
    setEditingProject({...editingProject, image: res.data.url});
  }

  if (!token) {
    return (
      <section className="contact" style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh'}}>
        <form onSubmit={login} className="contact-form show" style={{maxWidth:'500px'}}>
          <h2 className="heading">Admin <span>Login</span></h2>
          <div className="input-box"><input name="email" type="email" placeholder="Email" required /></div>
          <div className="input-box"><input name="password" type="password" placeholder="Password" required /></div>
          <button className="btn">Login</button>
        </form>
      </section>
    );
  }

  return (
    <section className="projects">
      <div style={{maxWidth:'1200px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'40px'}}>
          <h2 className="heading">Dashboard</h2>
          <button onClick={() => {localStorage.removeItem("token"); setToken(null)}} className="btn" style={{background:'linear-gradient(135deg, #ff4d4d, #ff1a1a)'}}>
            <FiLogOut /> Logout
          </button>
        </div>

        <div className="tech-stack" style={{justifyContent:'center', marginBottom:'40px', flexWrap:'wrap'}}>
          {["hero","about","services","projects","nav","social"].map(t => (
            <span key={t} onClick={() => setTab(t)} style={{
              cursor:'pointer', background: tab===t? 'var(--accent-grad)' : 'var(--card-bg)',
              color: tab===t? 'var(--bg)' : 'var(--accent)', border: '1px solid var(--accent)', padding: '10px 24px', borderRadius: '30px', fontWeight: 600, textTransform:'capitalize'
            }}>{t}</span>
          ))}
        </div>

        {loading? <p style={{textAlign:'center'}}>Loading...</p> : (
          <div className="project-card show" style={{padding:'40px', background:'var(--card-bg-2)'}}>

            {/* HERO TAB */}
            {tab === "hero" && (
              <>
                <h3 className="heading" style={{fontSize:'2rem'}}>Edit <span>Hero</span></h3>
                <div className="input-box"><input placeholder="Greeting" value={content.hero.greeting} onChange={e => setContent({...content, hero:{...content.hero, greeting:e.target.value}})} /></div>
                <div className="input-box"><input placeholder="Name" value={content.hero.name} onChange={e => setContent({...content, hero:{...content.hero, name:e.target.value}})} /></div>
                <label>Bio</label>
                <ReactQuill value={content.hero.bio} onChange={val => setContent({...content, hero:{...content.hero, bio:val}})} style={{marginBottom:'20px', background:'var(--bg)'}} />

                <h4 style={{color:'var(--accent)', margin:'20px 0 10px'}}>Roles - Typing Animation</h4>
                {content.hero.roles?.map((role, i) => (
                  <div className="input-box" key={i} style={{display:'flex', gap:'10px'}}>
                    <input placeholder={`Role ${i+1}`} value={role} onChange={e => updateArrayItem('hero.roles', i, e.target.value)} />
                    <button type="button" onClick={() => removeArrayItem('hero.roles', i)}><FiX /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('hero.roles')} className="btn" style={{padding:'8px', marginBottom:'20px'}}><FiPlus /> Add Role</button>

                <div className="input-box"><input placeholder="CTA Button Text" value={content.hero.ctaText} onChange={e => setContent({...content, hero:{...content.hero, ctaText:e.target.value}})} /></div>

                <label>Profile Photo</label>
                <div style={{display:'flex', gap:'10px', alignItems:'center', marginBottom:'20px'}}>
                  <input placeholder="Profile Photo URL" value={content.hero.profilePhoto} onChange={e => setContent({...content, hero:{...content.hero, profilePhoto:e.target.value}})} />
                  <label className="btn" style={{padding:'10px', cursor:'pointer'}}><FiUpload /> {uploading?'...':''}<input type="file" hidden onChange={e => handleUpload(e, 'hero.profilePhoto')} /></label>
                </div>
                {content.hero.profilePhoto && <img src={content.hero.profilePhoto} alt="preview" style={{width:'100px', borderRadius:'8px', marginBottom:'20px'}} />}

                <button onClick={saveContent} disabled={saving} className="btn">{saving? 'Saving...' : 'Save Hero'}</button>
              </>
            )}

            {/* ABOUT TAB - FIXED */}
            {tab === "about" && (
              <>
                <h3 className="heading" style={{fontSize:'2rem'}}>Edit <span>About</span></h3>
                <div className="input-box"><input placeholder="Title" value={content.about.title} onChange={e => setContent({...content, about:{...content.about, title:e.target.value}})} /></div>
                <div className="input-box"><input placeholder="Subtitle" value={content.about.subtitle} onChange={e => setContent({...content, about:{...content.about, subtitle:e.target.value}})} /></div>
                <textarea rows="5" placeholder="Description" value={content.about.description} onChange={e => setContent({...content, about:{...content.about, description:e.target.value}})} style={{width:'100%', padding:'14px', marginBottom:'20px'}}/>

                <label>About Photo</label> {/* FIXED: was content.aboutPhoto */}
                <div style={{display:'flex', gap:'10px', alignItems:'center', marginBottom:'20px'}}>
                  <input placeholder="About Photo URL" value={content.aboutPhoto} onChange={e => setContent({...content, about:{...content.about, aboutPhoto:e.target.value}})} />
                  <label className="btn" style={{padding:'10px', cursor:'pointer'}}><FiUpload /><input type="file" hidden onChange={e => handleUpload(e, 'about.aboutPhoto')} /></label>
                </div>
                {content.aboutPhoto && <img src={content.aboutPhoto} alt="preview" style={{width:'100px', borderRadius:'8px', marginBottom:'20px'}} />}

                <h4 style={{color:'var(--accent)', margin:'20px 0 10px'}}>Technical Skills</h4>
                {content.about.skills?.map((s,i) => (
                  <div key={i} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                    <input value={s} onChange={e => updateArrayItem('about.skills', i, e.target.value)} />
                    <button type="button" onClick={() => removeArrayItem('about.skills', i)}><FiX /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('about.skills')} className="btn" style={{padding:'8px'}}><FiPlus /> Add Skill</button>

                <h4 style={{color:'var(--accent)', margin:'20px 0 10px'}}>Tools</h4>
                {content.about.tools?.map((t,i) => (
                  <div key={i} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                    <input value={t} onChange={e => updateArrayItem('about.tools', i, e.target.value)} />
                    <button type="button" onClick={() => removeArrayItem('about.tools', i)}><FiX /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('about.tools')} className="btn" style={{padding:'8px', marginBottom:'20px'}}><FiPlus /> Add Tool</button>
                <button onClick={saveContent} disabled={saving} className="btn" style={{marginTop:'20px'}}>{saving? 'Saving...' : 'Save About'}</button>
              </>
            )}

            {/* SERVICES TAB */}
            {tab === "services" && (
              <>
                <h3 className="heading" style={{fontSize:'2rem'}}>Edit <span>Services</span></h3>
                {content.services?.map((s, i) => (
                  <div key={i} style={{border:'1px solid var(--border)', padding:'20px', borderRadius:'12px', marginBottom:'20px'}}>
                    <div className="input-box"><input placeholder="Service Title" value={s.title} onChange={e => updateArrayItem('services', i, {...s, title:e.target.value})} /></div>
                    <div className="input-box"><input placeholder="Tag: Popular, New" value={s.tag} onChange={e => updateArrayItem('services', i, {...s, tag:e.target.value})} /></div>
                    <textarea rows="3" placeholder="Description" value={s.desc} onChange={e => updateArrayItem('services', i, {...s, desc:e.target.value})} style={{width:'100%', padding:'14px', marginBottom:'10px'}}/>
                    <h5>Features:</h5>
                    {s.features?.map((f, fi) => (
                      <div key={fi} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                        <input value={f} onChange={e => {const newF = [...s.features]; newF[fi]=e.target.value; updateArrayItem('services', i, {...s, features:newF})}} />
                        <button onClick={() => {const newF = s.features.filter((_,idx)=>idx!==fi); updateArrayItem('services', i, {...s, features:newF})}}><FiX /></button>
                      </div>
                    ))}
                    <button onClick={() => {const newF = [...(s.features||[]), ""]; updateArrayItem('services', i, {...s, features:newF})}}><FiPlus /> Add Feature</button>
                    <button onClick={() => removeArrayItem('services', i)} style={{float:'right', color:'red'}}><FiTrash2 /></button>
                  </div>
                ))}
                <button onClick={() => addArrayItem('services', {title:"", tag:"", desc:"", features:[]})} className="btn"><FiPlus /> Add Service</button>
                <button onClick={saveContent} disabled={saving} className="btn" style={{marginTop:'20px'}}>{saving? 'Saving...' : 'Save Services'}</button>
              </>
            )}

            {/* PROJECTS TAB */}
            {tab === "projects" && (
              <>
                <h3 className="heading" style={{fontSize:'2rem'}}>Manage <span>Projects</span></h3>
                <button onClick={addProject} className="btn" style={{marginBottom:'20px'}}><FiPlus /> Add New Project</button>

                {editingProject && (
                  <div style={{border:'1px solid var(--border-accent)', padding:'20px', borderRadius:'12px', marginBottom:'20px'}}>
                    <h4>Edit Project</h4>
                    <div className="input-box"><input placeholder="Title" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title:e.target.value})} /></div>
                    <textarea rows="3" placeholder="Description" value={editingProject.description} onChange={e => setEditingProject({...editingProject, description:e.target.value})} style={{width:'100%', padding:'14px', marginBottom:'10px'}}/>
                    <div style={{display:'flex', gap:'10px', alignItems:'center', marginBottom:'10px'}}>
                      <input placeholder="Image URL" value={editingProject.image} onChange={e => setEditingProject({...editingProject, image:e.target.value})} />
                      <label className="btn" style={{padding:'10px', cursor:'pointer'}}><FiUpload /><input type="file" hidden onChange={handleProjectUpload} /></label>
                    </div>
                    <div className="input-box"><input placeholder="Live Link" value={editingProject.link} onChange={e => setEditingProject({...editingProject, link:e.target.value})} /></div>
                    <div className="input-box"><input placeholder="Github Link" value={editingProject.github} onChange={e => setEditingProject({...editingProject, github:e.target.value})} /></div>
                    <h5>Tech Stack:</h5>
                    {editingProject.tech?.map((t, i) => (
                      <div key={i} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                        <input value={t} onChange={e => {const newT=[...editingProject.tech]; newT[i]=e.target.value; setEditingProject({...editingProject, tech:newT})}} />
                        <button onClick={() => {const newT=editingProject.tech.filter((_,idx)=>idx!==i); setEditingProject({...editingProject, tech:newT})}}><FiX /></button>
                      </div>
                    ))}
                    <button onClick={() => setEditingProject({...editingProject, tech:[...editingProject.tech, ""]})}><FiPlus /> Add Tech</button>
                    <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                      <button onClick={saveProject} className="btn">Save Project</button>
                      <button onClick={() => setEditingProject(null)} className="btn" style={{background:'#666'}}>Cancel</button>
                    </div>
                  </div>
                )}

                <div className="projects-grid">
                  {projects.map(p => (
                    <div key={p._id} className="project-card show">
                      <div className="project-img"><img src={p.image} alt={p.title} /></div>
                      <div className="project-content">
                        <h3>{p.title}</h3>
                        <p>{p.description}</p>
                        <button onClick={() => setEditingProject(p)}><FiEdit /></button>
                        <button onClick={() => deleteProject(p._id)}><FiTrash2 /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* NAV TAB */}
            {tab === "nav" && (
              <>
                <h3 className="heading" style={{fontSize:'2rem'}}>Edit <span>Navbar</span></h3>
                <div style={{display:'flex', gap:'10px', alignItems:'center', marginBottom:'20px'}}>
                  <input placeholder="Logo URL" value={content.nav.logo} onChange={e => setContent({...content, nav:{...content.nav, logo:e.target.value}})} />
                  <label className="btn" style={{padding:'10px', cursor:'pointer'}}><FiUpload /><input type="file" hidden onChange={e => handleUpload(e, 'nav.logo')} /></label>
                </div>
                {content.nav.logo && <img src={content.nav.logo} alt="logo" style={{height:'40px', marginBottom:'20px'}} />}
                <button onClick={saveContent} className="btn">Save Nav</button>
              </>
            )}

            {/* SOCIAL TAB */}
            {tab === "social" && (
              <>
                <h3 className="heading" style={{fontSize:'2rem'}}>Edit <span>Social Links</span></h3>
                <div className="input-box"><input placeholder="GitHub URL" value={content.social.github} onChange={e => setContent({...content, social:{...content.social, github:e.target.value}})} /></div>
                <div className="input-box"><input placeholder="LinkedIn URL" value={content.social.linkedin} onChange={e => setContent({...content, social:{...content.social, linkedin:e.target.value}})} /></div>
                <div className="input-box"><input placeholder="TikTok URL" value={content.social.tiktok} onChange={e => setContent({...content, social:{...content.social, tiktok:e.target.value}})} /></div>
                <div className="input-box"><input placeholder="Email" value={content.social.email} onChange={e => setContent({...content, social:{...content.social, email:e.target.value}})} /></div>
                <button onClick={saveContent} className="btn">Save Social</button>
              </>
            )}
          </div>
        )}
      </div>
      <style>{`.ql-toolbar{background:var(--bg-2)!important;border-color:var(--border)!important}.ql-container{background:var(--bg)!important;border-color:var(--border)!important;color:var(--text)!important}`}</style>
    </section>
  );
}