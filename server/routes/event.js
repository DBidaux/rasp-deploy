const express = require("express");
const router = express.Router();
const Event = require("../models/event_schema");

//get para mostrar events
router.get("/", async (req, res) => {
	try {
		const events = await Event.find({
			date: { $gte: new Date() },
			active: true,
		});
		res.status(200).json(events);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

//post para crear evento
router.post("/newevent", async (req, res) => {
	const event = new Event({
		date: req.body.date,
		eventInfo: req.body.eventInfo,
		additionalNote: req.body.additionalNote,
		time: req.body.time,
		active: req.body.active !== undefined ? req.body.active : true,
	});
	try {
		const newEvent = await event.save();
		res.status(201).json(newEvent);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

//patch no se pa que, para lleva control?
router.patch("/:id/active", async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) {
			return res.status(404).json({ message: "Evento no encontrado" });
		}
		event.active = !event.active;
		await event.save();
		res.json(event);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

//borrar cena
router.delete("/:id", async (req, res) => {
	try {
		const event = await Event.findByIdAndDelete(req.params.id);
		if (!event) {
			return res.status(404).json({ message: "Evento no encontrado" });
		}
		res.json({ message: "Evento eliminado" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});
module.exports = router;
