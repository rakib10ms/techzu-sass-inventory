import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/user.repository';

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
};
