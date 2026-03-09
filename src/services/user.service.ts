import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/user.repository';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
export const userService = {
  createUser: async (data: any) => {
    // পাসওয়ার্ড হ্যাশ করা (Salt round: 10)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return userRepository.create({
      ...data,
      password: hashedPassword,
    });
  },

  getAllUsers: async () => userRepository.findAll(),

  getUserById: async (id: number) => userRepository.findById(id),

  // আপডেট করার সময় পাসওয়ার্ড থাকলে সেটাও হ্যাশ করতে হবে
  updateUser: async (id: number, data: any) => {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return userRepository.update(id, data);
  },

  deleteUser: async (id: number) => userRepository.delete(id),

  loginUser: async (email: string, pass: string) => {
    // 1. User khuje ber kora
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // 2. Password check kora (Hash comparison)
    const isPasswordMatch = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    // 3. Token toiri kora
    const token = jwt.sign(
      { id: user.id, role: user.role, outlet_id: user.outlet_id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Password bad diye user data return kora
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  },
};
