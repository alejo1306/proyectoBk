import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' } // 'admin' o 'user'
});

const UserModel = mongoose.model('User', userSchema);

export { UserModel };