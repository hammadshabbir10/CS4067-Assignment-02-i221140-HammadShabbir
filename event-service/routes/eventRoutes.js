const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  checkAvailability,
} = require("../controllers/eventController");

const router = express.Router();

router.post("/", createEvent); 
router.get("/", getEvents); 
router.get("/:event_id", getEventById); 
router.get("/:event_id/availability", checkAvailability); 

module.exports = router;

/*
📌 POST http://localhost:5001/events

json
Copy
Edit
{
  "name": "Tech Conference 2025",
  "date": "2025-06-10",
  "location": "New York",
  "availableTickets": 100
}
Get All Events
📌 GET http://localhost:5001/events

Get Event by ID
📌 GET http://localhost:5001/events/{event_id}

Check Availability
📌 GET http://localhost:5001/events/{event_id}/availability&
 */