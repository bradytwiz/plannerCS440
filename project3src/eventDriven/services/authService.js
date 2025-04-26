import bcrypt from 'bcryptjs';
import userService from './userService.js';

class AuthService {
    async authenticate({ userName, password }) {
        const user = await userService.getUser(userName);

        if (!user) {
            throw new Error('Invalid username or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid username or password');
        }

        return { id: user.id, userName: user.userName };
    }

    async createUser({ userName, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return userService.createUser(userName, email, hashedPassword);
    }
}

export default new AuthService();