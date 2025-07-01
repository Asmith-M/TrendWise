import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Boolean,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;