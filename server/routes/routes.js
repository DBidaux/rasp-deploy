const express = require("express");
const router = express.Router();

const loginRoutes = require("./login.js");
const registerRoute = require("./register.js");
const resetPasswordRoute = require("./itemsEmail/resetpassword.js");
const newPasswordRoute = require("./newpassword.js");
const shoppingListRoute = require("./list.js");
const eventRoutes = require("./event.js");
const profileRoute = require("./profile.js");
const approveUserRoute = require("./itemsEmail/approveUser.js");
const billsRoute = require("./bill.js");
const accountRoute = require("./funds.js")

router.use("/login", loginRoutes);
router.use("/Register", registerRoute);
router.use("/resetpassword", resetPasswordRoute);
router.use("/newpassword", newPasswordRoute);
router.use("/shoppinglist", shoppingListRoute);
router.use("/events", eventRoutes);
router.use("/profile", profileRoute);
router.use("/approve", approveUserRoute);
router.use("/bills", billsRoute);
router.use("/account", accountRoute)


module.exports = router;
