// UserModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' } // 'admin' o 'user'
});

// Método para verificar si la contraseña es válida
userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const UserModel = mongoose.model('User', userSchema);

export { UserModel };
