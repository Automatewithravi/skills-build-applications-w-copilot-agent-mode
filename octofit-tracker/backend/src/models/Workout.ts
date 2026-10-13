import mongoose, { Schema } from 'mongoose';

export interface Workout {
  title: string;
  description: string;
  activityType: 'run' | 'cycle' | 'swim' | 'strength' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  exercises: string[];
}

const workoutSchema = new Schema<Workout>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    activityType: {
      type: String,
      enum: ['run', 'cycle', 'swim', 'strength', 'other'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    exercises: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export default mongoose.model<Workout>('Workout', workoutSchema);
