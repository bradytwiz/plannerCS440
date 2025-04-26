import userEvents from '../events/userEvents.js';
import eventEvents from '../events/eventEvents.js';
import typeEvents from '../events/typeEvents.js';

export const getUserDataHandler = async (req, res) => {
    const userId = req.headers["user-id"];

    if (!userId) {
        return res.status(401).json({ error: "User not logged in" });
    }

    userEvents.emit('getUserData', userId, async (error, user) => {
        if (error || !user) {
            return res.status(404).json({ error: "User not found" });
        }

        eventEvents.emit('getEvents', (error, events) => {
            if (error) {
                return res.status(500).json({ error: "Error retrieving events" });
            }

            typeEvents.emit('getTypes', (error, types) => {
                if (error) {
                    return res.status(500).json({ error: "Error retrieving types" });
                }

                res.json({ user, events, types });
            });
        });
    });
};