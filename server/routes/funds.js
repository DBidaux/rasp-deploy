const express = require("express");
const AccountFunds = require("../models/account_schema");
const router = express.Router();

router.get("/getstatus", async (req, res) => {
    try {
        const funds = await AccountFunds.findOne().sort({ createdAt: -1 }).select('accountFunds');
		
        res.json(funds);
    } catch (error) {
        console.error("Error fetching funds: ", error);
        res.status(500).json("Error fetching funds.");
    }
});

router.post("/postfunds", async (req, res) => {
	const funds = new AccountFunds({
		accountFunds: req.body.accountFunds,
		createdAt: new Date(),
	});
	try {
		const updatedFunds = await funds.save();
		res.status(201).json(updatedFunds);
	} catch (error) {
		res.status(400).json({ ok: false, message: error.message });
	}
});

module.exports = router;

