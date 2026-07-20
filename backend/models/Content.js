import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  hero: {
    name: String, bio: String, ctaText: String, greeting: String,
    roles: [String], profilePhoto: String
  },
 about: {
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  aboutPhoto: { type: String, default: "" },
  cvLink: { type: String, default: "" },
  description: { type: String, default: "" },
  aboutHeadline: { type: String, default: "" },
  drivesMe: { type: String, default: "" },
  goals: { type: String, default: "" },
  skills: { type: Array, default: [] }
},
  nav: { logo: String },
  social: { github: String, linkedin: String, tiktok: String, email: String },
  services: [{ title: String, desc: String, tag: String, features: [String] }],
  experience: {
    stats: [{number: String, label: String, icon: String, color: String}],
    items: [{year: String, role: String, company: String, description: String, tags: [String]}]
  }
}, { timestamps: true });

export default mongoose.models.Content || mongoose.model("Content", contentSchema);