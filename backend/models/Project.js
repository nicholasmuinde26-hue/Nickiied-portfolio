import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  link: { type: String, default: "" },
  github: { type: String, default: "" },
  tech: [{ type: String }],
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Prevent overwrite error on hot reload
export default mongoose.models.Project || mongoose.model("Project", projectSchema);