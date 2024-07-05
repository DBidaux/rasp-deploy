const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user_schema");

const router = express.Router();
const saltRounds = 10;

router.post("/:token", async (req, res) => {

	console.log("Request para cambiar pass");
	
    const { token } = req.params; // Extrayendo el token de los parámetros de ruta
	const { password } = req.body;

	console.log("token:", token);
	console.log("pass:", password);

	try {
		const user = await User.findOne({
			resetPasswordToken: token,
		});

		if (!user) {
			console.error("Invalid or expired token"); 
			return res
				.status(400)
				.send("Password reset token is invalid or has expired");
		}

		const hashedPassword = await bcrypt.hash(password, saltRounds);
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save();

		console.log("Password has been changed");
		res.status(200).send("Password has been changed");
	} catch (error) {
		console.error("Error processing request:", error); 
		res.status(500).send("Internal server error");
	}
});

module.exports = router;
