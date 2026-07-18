import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true, 
    select: false // hides password by default
  },
}, { timestamps: true });

export default mongoose.model("Admin", AdminSchema);