import bcrypt from 'bcryptjs';
import { getUser, createUser } from '../repositories/userRepository.js';

export async function loginUser(userName, password) {
  const user = await getUser(userName);
  if (!user) throw new Error("User not found");
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid password");

  return { id: user.id, userName: user.userName };
}

export async function registerUser(userName, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return createUser(userName, email, hashedPassword);
}