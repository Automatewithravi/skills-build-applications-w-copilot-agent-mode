import mongoose, { Schema, Types } from 'mongoose';

export interface Activity {
  user: Types.ObjectId;
  type: 'run' | 'cycle' | 'swim' | 'strength' | 'other';
  durationMinutes: number;
  distanceKm?: number;
  calories?: number;
  recordedAt: Date;
}

const activitySchema = new Schema<Activity>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['run', 'cycle', 'swim', 'strength', 'other'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    calories: { type: Number, min: 0 },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model<Activity>('Activity', activitySchema);
