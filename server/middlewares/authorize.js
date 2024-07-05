// middleware/authorize.js
const jwt = require("jsonwebtoken");
const User = require("../models/user_schema");

//middleware para que ADMIN pueda borrar la lista que quiera
const authorize = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			return res.status(401).json({ message: "No autorizado" });
		}

		const decoded = jwt.verify(token, process.env.SEED);
		const user = await User.findById(decoded.user._id);

		if (!user) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}

		req.user = user; // Añade el usuario a la solicitud
		next();
	} catch (error) {
		res.status(401).json({ message: "No autorizado" });
	}
};

module.exports = { authorize };
