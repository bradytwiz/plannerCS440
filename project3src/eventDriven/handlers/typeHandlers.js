import typeEvents from '../events/typeEvents.js';

export const getTypesHandler = async (req, res) => {
    typeEvents.emit('getTypes', (error, types) => {
        if (error) {
            return res.status(500).json({ error: "Error retrieving types" });
        }
        res.json({ types });
    });
};

export const createTypeHandler = async (req, res) => {
    const { name, importance, color } = req.body;
    if (!name || !importance || !color) {
        return res.status(400).json({ error: "All type fields are required" });
    }

    typeEvents.emit('createType', { name, importance, color }, (error, newType) => {
        if (error) {
            return res.status(500).json({ error: "Error creating type" });
        }
        res.status(201).json({ message: "Type created", type: newType });
    });
};