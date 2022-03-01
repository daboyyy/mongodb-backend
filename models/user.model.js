import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  hash: String,
  salt: String,
  username: String,
  name: String,
});

const User = mongoose.model('User', UserSchema);

export default User;
