import mongoose, { Schema, Types } from 'mongoose';

export interface LeaderboardEntry {
  user: Types.ObjectId;
  points: number;
  rank: number;
}

const leaderboardSchema: Schema<LeaderboardEntry> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  points: { type: Number, default: 0, min: 0 },
  rank: { type: Number, required: true, min: 1 },
}, { timestamps: true });

export default mongoose.model('Leaderboard', leaderboardSchema);
