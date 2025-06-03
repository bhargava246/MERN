import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import mongoose from 'mongoose';

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, SALT_ROUNDS);
  }
  next();
});

export const User = mongoose.model('User', userSchema);

// Authentication functions
export const createUser = async (email: string, password: string, name: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    email,
    password,
    name
  });

  const token = generateToken(user._id.toString());
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id.toString());
  return { user, token };
};

export const generateToken = (userId: string) => {
  return sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    const decoded = verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const getUserById = async (userId: string) => {
  return User.findById(userId).select('-password');
};