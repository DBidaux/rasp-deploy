const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const eventSchema = new Schema({
	date: {
		type: Date,
		required: true,
	},
	time: {
		type: String,
	},
	eventInfo: {
		type: String,
		required: true,
	},
	additionalNote: {
		type: String,
	},
	active: {
		type: Boolean,
		default: true,
	},
});
module.exports = mongoose.model("Event", eventSchema);
