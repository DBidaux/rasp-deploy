// routes/approveUser.js
const express = require("express");
const User = require("../../models/user_schema");
const transporter = require("../itemsEmail/mailer");

const router = express.Router();

router.post("/", async (req, res) => {
	const { username } = req.body;

	try {
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(404).json({ ok: false, error: "User not found" });
		}

		user.isApproved = true;
		await user.save();

		// Enviar notificación al usuario
		const mailOptions = {
			to: user.email,
			from: process.env.EMAIL_USER,
			subject: "Cuenta Aprobada",
			text: `Hola ${user.username},\n\nTu cuenta ha sido aprobada por un administrador. Ya puedes iniciar sesión.\n\nSaludos,\nEl Equipo`,
		};

		transporter.sendMail(mailOptions, (err, response) => {
			if (err) {
				return res
					.status(500)
					.json({ ok: false, error: "Error sending email" });
			}
			res.status(200).json({
				ok: true,
				message: "User approved and notified",
			});
		});
	} catch (err) {
		res.status(500).json({ ok: false, error: err.message });
	}
});

module.exports = router;
