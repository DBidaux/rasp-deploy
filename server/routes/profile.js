const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/user_schema");
const auth = require("../middlewares/auth");

const router = express.Router();

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = "uploads/";
		cb(null, dir);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const fileTypes = /jpeg|jpg|png|gif/;
		const extname = fileTypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimeType = fileTypes.test(file.mimetype);

		if (extname && mimeType) {
			return cb(null, true);
		} else {
			cb("Error: Images Only!");
		}
	},
});

// Endpoint para obtener la información del perfil del usuario autenticado
router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Error al obtener el perfil", error });
	}
});

// Endpoint para actualizar el perfil del usuario
router.post(
	"/update",
	[auth, upload.single("profileImage")],
	async (req, res) => {
		try {
			const { username, email, phone } = req.body;
			const profileImage = req.file ? req.file.filename : null;

			const user = await User.findById(req.user._id);
			if (!user) {
				return res
					.status(404)
					.json({ message: "Usuario no encontrado" });
			}

			// Actualiza la información del usuario
			user.username = username || user.username;
			user.email = email || user.email;
			if (profileImage) {
				user.profileImage = profileImage;
			}

			await user.save();
			res.status(200).json({
				message: "Perfil actualizado correctamente",
				user,
			});
		} catch (error) {
			res.status(400).json({
				message: "Error al actualizar el perfil",
				error,
			});
		}
	}
);

module.exports = router;
