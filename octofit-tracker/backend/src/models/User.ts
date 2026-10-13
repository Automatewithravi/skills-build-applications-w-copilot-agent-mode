import mongoose, { Schema } from 'mongoose';

export interface User {
  username: string;
  displayName: string;
  email: string;
}

const userSchema: Schema<User> = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  displayName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
