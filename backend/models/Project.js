import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // URL or /uploads/path
  alt: { type: String, default: "" },
  tech: { type: [String], default: [] },

  // legacy compatibility
  techStack: { type: [String], default: [] },
  link: { type: String, default: "" },
  liveDemo: { type: String, default: "" },
  github: { type: String, default: "" },
  order: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true }, // cleaner than setting twice
  toObject: { virtuals: true }
});

// Virtuals: prefer `tech` and `link` when reading
projectSchema.virtual("techResolved").get(function () {
  return (this.tech && this.tech.length)? this.tech : (this.techStack || []);
});
projectSchema.virtual("linkResolved").get(function () {
  return this.link || this.liveDemo || this.github || "";
});

const Project = mongoose.model("Project", projectSchema);
export default Project;