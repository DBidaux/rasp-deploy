const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

const validRoles = {
	values: ["ADMIN", "USER"],
	message: "{VALUE} is not a valid role",
};

let userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: [true, "Username is required"],
		min: 6,
		max: 64,
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Email is required"],
		min: 6,
		max: 1024,
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		minlength: 6,
	},
	role: {
		type: String,
		default: "USER",
		enum: validRoles,
	},
	profileImage: {
		type: String,
	},
	resetPasswordToken: {
		type: String,
	},
	resetPasswordExpires: {
		type: Date,
	},
	isApproved: {
		type: Boolean,
		default: false,
	},
});

//Función para eliminar el campo password del objeto que se devuelve.
userSchema.methods.toJSON = function () {
	const user = this;

	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.role;
	delete userObject.__v;

	return userObject;
};

userSchema.plugin(uniqueValidator, { message: "{PATH} should be unique" });

module.exports = mongoose.model("User", userSchema);
