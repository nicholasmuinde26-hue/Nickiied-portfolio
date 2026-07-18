import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCheckCircle, FaGithub, FaLinkedin, FaTiktok, FaPaperPlane } from "react-icons/fa";

const Contact = ({ formData, setFormData, handleSubmit, status, content }) => {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-header">
          <p className="section-tag">GET IN TOUCH</p>
          <h2 className="heading">Let's <span>Work Together</span></h2>
          <p className="subheading">
            Ready to bring your ideas to life? I'm here to help you build innovative solutions 
            that drive your business forward. Let's discuss your project!
          </p>
        </div>

        <div className="contact-wrapper">
          {/* 1. INFO CARDS */}
          <div className="contact-info">
            <div className="info-card glass">
              <div className="info-icon" style={{background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff'}}>
                <FaEnvelope />
              </div>
              <div>
                <h4>Email</h4>
                <p>{content.social.email || 'your@email.com'}</p>
                <span>I respond within 24 hours</span>
              </div>
            </div>

            <div className="info-card glass">
              <div className="info-icon" style={{background: 'rgba(124, 240, 61, 0.1)', color: '#7cf03d'}}>
                <FaPhoneAlt />
              </div>
              <div>
                <h4>Phone</h4>
                <p>+254 792971466</p>
                <span>Available Mon-Fri, 9AM-6PM EAT</span>
              </div>
            </div>

            <div className="info-card glass">
              <div className="info-icon" style={{background: 'rgba(255, 167, 38, 0.1)', color: '#ffa726'}}>
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4>Location</h4>
                <p>Machakos, Kenya</p>
                <span>Open to global remote work</span>
              </div>
            </div>
          </div>

          {/* 2. GUARANTEE + SOCIALS MERGED */}
          <div className="guarantee-box glass">
            <div className="guarantee-content">
              <FaCheckCircle className="guarantee-icon" />
              <div>
                <h4>24-Hour Response Guarantee</h4>
                <p>
                  I respect your time. Every inquiry gets a personal response within 24 hours. 
                  No bots, no auto-replies. Just real solutions to move your project forward fast.
                </p>
              </div>
            </div>
            <div className="guarantee-socials">
              <span>Or connect directly:</span>
              <div className="social-icons">
                {content.social.github && <a href={content.social.github} target="_blank"><FaGithub /></a>}
                {content.social.linkedin && <a href={content.social.linkedin} target="_blank"><FaLinkedin /></a>}
                {content.social.tiktok && <a href={content.social.tiktok} target="_blank"><FaTiktok /></a>}
              </div>
            </div>
          </div>

          {/* 3. CONTACT FORM */}
          <form className="contact-form glass" onSubmit={handleSubmit}>
            <div className="form-header">
              <FaPaperPlane />
              <h3>Send Message</h3>
            </div>
            <div className="input-box">
              <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div className="input-box">
              <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              <input type="text" placeholder="Subject" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required />
            </div>
            <textarea placeholder="Tell me about your project..." rows="5" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required></textarea>
            
            <button type="submit" className="btn" disabled={status === 'Sending...'}>
              {status === 'Sending...' ? 'Sending...' : 'Send Message'}
            </button>
            {status && <p className={`status-msg ${status.includes('✅') ? 'success' : 'error'}`}>{status}</p>}
          </form>

          {/* 4. WHAT HAPPENS NEXT */}
          <div className="what-next-box">
            <h4>What happens next?</h4>
            <p>
              I'll review your project details and respond within 24 hours with questions, 
              timeline estimates, and next steps. For complex projects, I'll schedule a free 
              consultation call to discuss your requirements in detail.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Contact;