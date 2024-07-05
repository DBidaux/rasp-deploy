const mongoose = require("mongoose");

let Schema = mongoose.Schema;

const accountSchema = new Schema({
	accountFunds: {
		type: Number,
		required: true,
	},
	createdAt: {
		type: Date,
	},
});

const accountFunds = mongoose.model("AccountFunds", accountSchema);
module.exports = accountFunds;
