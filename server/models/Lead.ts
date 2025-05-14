import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  summary: string;
  profileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    jobTitle: { type: String },
    company: { type: String },
    location: { type: String },
    summary: { type: String },
    profileUrl: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILead>('Lead', LeadSchema);