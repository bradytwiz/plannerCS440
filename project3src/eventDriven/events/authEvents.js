import EventEmitter from 'events';
import authService from '../services/authService.js';

class AuthEvents extends EventEmitter {
    constructor() {
        super();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.on('login', async (credentials, callback) => {
            try {
                const user = await authService.authenticate(credentials);
                callback(null, user);
            } catch (error) {
                callback(error);
            }
        });

        this.on('signup', async (userData, callback) => {
            try {
                const newUser = await authService.createUser(userData);
                callback(null, newUser);
            } catch (error) {
                callback(error);
            }
        });
    }
}

export default new AuthEvents();