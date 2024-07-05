const mongoose = require("mongoose");

let Schema = mongoose.Schema;

const billSchema = new Schema({
	company: {
		type: String,
	},
	paymentDate: {
		type: String,
	},
	amount: {
		type: Number,
	},
	consumption: {
		type: Number,
	},
	active: {
		type: Boolean,
		default: true,
	},
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
