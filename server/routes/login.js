const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user_schema = require("../models/user_schema.js");
const router = express.Router();

router.post("/", async (req, res) => {
	const body = req.body;
	try {
		const userDB = await user_schema.findOne({ email: body.email }).exec();

		if (!userDB) {
			return res.status(400).json({
				ok: false,
				error: "Usuario no encontrado",
			});
		}

		const isPasswordValid = bcrypt.compareSync(
			body.password,
			userDB.password
		);
		if (!isPasswordValid) {
			return res
				.status(400)
				.json({ ok: false, error: "Contraseña incorrecta" });
		}

		if (!userDB.isApproved) {
			return res.status(400).json({
				ok: false,
				error: "Cuenta no aprobada. Por favor contacta con el administrador.",
			});
		}

		const token = jwt.sign({ user: userDB }, process.env.SEED, {
			expiresIn: "360min",
		});

		return res.status(200).json({
			ok: true,
			message: "Login correcto",
			userID: userDB._id,
			username: userDB.username,
			role: userDB.role,
			token,
		});
	} catch (error) {
		return res.status(500).json({ ok: false, error: error.message });
	}
});

module.exports = router;

// {
// 	"username":"Didier",
// 	"email":"Didier3@gmail.com",
// 	"password":"123456",
// 	"role":"ADMIN"

// }

// {

// 	"email":"Didier3@gmail.com",
// 	"password":"123456"

// }
