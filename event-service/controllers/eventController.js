const Event = require("../models/eventModel");

// ✅ Create an event (Auto-Increment or Provide `id`)
exports.createEvent = async (req, res) => {
  try {
    const { id, name, date, location, availableTickets } = req.body;

    // ❌ Prevent duplicate IDs
    const existingEvent = await Event.findOne({ id });
    if (existingEvent) return res.status(400).json({ error: "Event ID already exists" });

    const event = new Event({ id, name, date, location, availableTickets });
    await event.save();

    res.status(201).json({ message: "Event created successfully!", event });
  } catch (err) {
    res.status(500).json({ error: "Failed to create event", details: err.message });
  }
};

// ✅ Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// ✅ Get event by Integer `id` (Use `findOne({ id })` Instead of `findById`)
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ id: parseInt(req.params.event_id) });
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

// ✅ Check event availability by `id`
exports.checkAvailability = async (req, res) => {
  try {
    const event = await Event.findOne({ id: parseInt(req.params.event_id) });
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json({ availableTickets: event.availableTickets });
  } catch (err) {
    res.status(500).json({ error: "Failed to check availability" });
  }
};
