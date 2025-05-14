import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'deleted';
  leads: string[];
  accountIDs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'inactive', 'deleted'],
      default: 'inactive',
    },
    leads: [{ type: String }], // Array of LinkedIn URLs
    accountIDs: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
  },
  { timestamps: true }
);

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);