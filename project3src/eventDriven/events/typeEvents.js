import EventEmitter from 'events';
import typeService from '../services/typeService.js';

class TypeEvents extends EventEmitter {
    constructor() {
        super();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.on('getTypes', async (callback) => {
            try {
                const types = await typeService.getTypes();
                callback(null, types);
            } catch (error) {
                callback(error);
            }
        });

        this.on('createType', async (typeData, callback) => {
            try {
                const newType = await typeService.createType(typeData);
                callback(null, newType);
            } catch (error) {
                callback(error);
            }
        });
    }
}

export default new TypeEvents();