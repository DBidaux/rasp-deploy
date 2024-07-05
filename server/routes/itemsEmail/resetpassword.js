const express = require("express");
const bcrypt = require("bcrypt");
const transporter = require("./mailer");
const User = require("../../models/user_schema");

const router = express.Router();
const saltRounds = 10;

router.post("/", async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		res.status(400).send("Email not found");
	}

	let token = await bcrypt.hash(user.email + Date.now(), saltRounds);

	//error del token de las /
	token = token.replace(/\//g, "-");

	user.resetPasswordToken = token;
	console.log(token);
	user.resetPasswordExpire = Date.now() + 3600000;
	await user.save();

	const mailOptions = {
		to: user.email,
		from: process.env.EMAIL_USER,
		subject: "Password Reset",
		text: `\n\n Estás recibiendo este correo porque has olvidado la contraseña de ingreso, y has solicitado resetear la contraseña.\n\n
        Por favor, sigue el siguiente link, o pégalo en tu navegador para completar el proceso:\n\n
        http://${process.env.CLIENT_URL}/newpassword/${token}\n\n
        Si no has sido tú el que ha solicitado el cambio de contraseña, por favor ignora este correo. Tu contraseña está segura y no ha cambiado.\n`,
	};
	transporter.sendMail(mailOptions, (err, response) => {
		if (err) {
			return res.status(500).send("Error sending email");
		}
		res.status(200).send("Recovery email sent");
	});
});

module.exports = router;
