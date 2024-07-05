const express = require("express");
const router = express.Router();
const ShoppingList = require("../models/list_schema.js");
const { authorize } = require("../middlewares/authorize.js");

// get de todas las listas
router.get("/", authorize, async (req, res) => {
	try {
		const lists = await ShoppingList.find({
			$or: [{ active: true }],
		});
		res.status(200).json({ lists, role: req.user.role });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// get de las listas inactivas que no superen los 6 meses
router.get("/inactive", async (req, res) => {
	try {
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		const lists = await ShoppingList.find({
			active: false,
			deactivatedAt: { $gt: sixMonthsAgo },
		});
		res.status(200).json(lists);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

//Para listas de mas de 6 meses
router.get("/history", async (req, res) => {
	try {
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		const lists = await ShoppingList.find({
			active: false,
			deactivatedAt: { $lt: sixMonthsAgo },
		});
		res.status(200).json(lists);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// post para crear una lista nueva
router.post("/newlist", authorize, async (req, res) => {
	const lista = new ShoppingList({
		nombreLista: req.body.nombreLista,
		numeroPersonas: req.body.numeroPersonas,
		persona: req.body.persona,
		products: req.body.products,
		totalGastado: req.body.totalGastado,
		totalPorPersona: req.body.totalPorPersona,
		active: req.body.active !== undefined ? req.body.active : true,
		creatorID: req.body.creatorID,
		allDebtsPaid: false,
	});
	try {
		const nuevaLista = await lista.save();
		res.status(201).json(nuevaLista);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// patch para cambiar el estado active
router.patch("/:id/active", authorize, async (req, res) => {
	try {
		const lista = await ShoppingList.findById(req.params.id);
		if (!lista) {
			return res.status(404).json({ message: "Lista no encontrada" });
		}

		const { userID } = req.body;

		// Verificar si el usuario es administrador
		const isAdmin = req.user.role === "ADMIN";

		// Permitir a los administradores archivar cualquier lista
		// Permitir a los usuarios archivar solo sus propias listas
		if (isAdmin || lista.creatorID.toString() === userID) {
			lista.active = !lista.active;
			if (!lista.active) {
				lista.deactivatedAt = new Date();
			}
			await lista.save();
			res.json({ lista, role: req.user.role });
		} else {
			res.status(403).json({
				message: "No tienes permiso para archivar esta lista",
			});
		}
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

module.exports = router;
