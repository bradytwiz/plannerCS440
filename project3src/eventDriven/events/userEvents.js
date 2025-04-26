import EventEmitter from 'events';
import userService from '../services/userService.js';

class UserEvents extends EventEmitter {
    constructor() {
        super();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.on('getUserData', async (userId, callback) => {
            try {
                const user = await userService.getUserById(userId);
                callback(null, user);
            } catch (error) {
                callback(error);
            }
        });
    }
}

export default new UserEvents();