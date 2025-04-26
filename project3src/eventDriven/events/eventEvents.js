import EventEmitter from 'events';
import eventService from '../services/eventService.js';

class EventEvents extends EventEmitter {
    constructor() {
        super();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.on('getEvents', async (callback) => {
            try {
                const events = await eventService.getEvents();
                callback(null, events);
            } catch (error) {
                callback(error);
            }
        });

        this.on('createEvent', async (eventData, callback) => {
            try {
                const newEvent = await eventService.createEvent(eventData);
                callback(null, newEvent);
            } catch (error) {
                callback(error);
            }
        });

        this.on('getUserEvents', async (query, callback) => {
            try {
                const events = await eventService.getUserEvents(query);
                callback(null, events);
            } catch (error) {
                callback(error);
            }
        });
    }
}

export default new EventEvents();