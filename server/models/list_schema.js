const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let productSchema = new Schema({
	nombre: { type: String },
	precio: { type: Number },
	cantidad: { type: Number },
});

let listSchema = new Schema({
	nombreLista: {
		type: String,
	},
	numeroPersonas: {
		type: Number,
	},
	persona: {
		type: String,
	},
	products: [productSchema],
	totalGastado: {
		type: Number,
	},
	totalPorPersona: {
		type: Number,
	},
	active: {
		type: Boolean,
		default: true,
	},
	creatorID: {
		type: String,
		required: true,
	},
	allDebtsPaid: {
		type: Boolean,
		default: false,
	},
	deactivatedAt: {
		type: Date,
		default: null,
	},
	deactivationCount: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model("List", listSchema);
