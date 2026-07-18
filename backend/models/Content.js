import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  hero: {
    greeting: { type: String },
    name: { type: String },
    bio: { type: String },
    ctaText: { type: String },
    roles: { type: [String], default: [] },
    profilePhoto: { type: String }
  },
  about: {
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    skills: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    aboutPhoto: { type: String }
  },
  nav: { logo: { type: String } },
  social: {
    email: { type: String },
    github: { type: String },
    linkedin: { type: String },
    tiktok: { type: String }
  },
  services: {
    type: [{
      _id: false, // prevents mongoose from adding _id to each service
      title: { type: String, default: "" },
      tag: { type: String, default: "" },
      desc: { type: String, default: "" },
      features: { type: [String], default: [] }
    }],
    default: []
  }
}, { timestamps: true });

export default mongoose.model("Content", ContentSchema);