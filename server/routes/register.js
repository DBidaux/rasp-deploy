const express = require("express");
const User = require("../models/user_schema.js");
const router = express.Router();
const bcrypt = require("bcrypt");
const sendEmailToAdmins = require("./itemsEmail/sendMailToADMIN.js");

router.post("/", async (req, res) => {
	const { username, email, password, role, profileImage } = req.body;

	try {
		// Verificar si el usuario ya existe
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res
				.status(400)
				.json({ ok: false, error: "Email already exists" });
		}

		const userNameExists = await User.findOne({ username });
		if (userNameExists) {
			return res
				.status(400)
				.json({ ok: false, error: "Username already exists" });
		}

		// Encriptar la contraseña
		const hashedPassword = bcrypt.hashSync(password, 10);

		// Verificar si es el primer usuario
		const usersCount = await User.countDocuments();
		let userRole = role;
		let userIsApproved = false;

		if (usersCount === 0) {
			userRole = "ADMIN";
			userIsApproved = true;
		}

		// Crear el nuevo usuario
		const user = new User({
			username,
			email,
			password: hashedPassword,
			role: userRole,
			profileImage,
			isApproved: userIsApproved,
		});

		const savedUser = await user.save();

		// Si el usuario no es ADMIN, enviar correo a los administradores
		if (userRole !== "ADMIN") {
			const admins = await User.find({ role: "ADMIN" });
			await sendEmailToAdmins(admins, savedUser);
		}

		res.status(201).json({ ok: true, savedUser });
	} catch (err) {
		res.status(400).json({ ok: false, error: err.message });
	}
});

module.exports = router;
