const express = require("express");
const { bookEvent } = require("../controllers/bookingController");

const router = express.Router();

router.post("/bookings", bookEvent);

module.exports = router;
