// middlewares/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
	const token = req.header("Authorization").replace("Bearer ", "");

	if (!token) {
		return res
			.status(401)
			.json({ message: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, process.env.SEED);
		req.user = decoded.user;
		next();
	} catch (e) {
		res.status(401).json({ message: "Token is not valid" });
	}
};

module.exports = auth;
