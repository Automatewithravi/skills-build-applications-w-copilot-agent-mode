import mongoose, { Schema, Types } from 'mongoose';

export interface Team {
  name: string;
  members: Types.ObjectId[];
  points: number;
}

const teamSchema: Schema<Team> = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  points: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
