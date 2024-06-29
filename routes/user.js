const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { redirectUrl } = require('../middleware.js');
const userController = require("../controllers/users.js");


router.route("/signup")
    .get( wrapAsync(userController.renderFormForUserSignup))
    .post( wrapAsync(userController.userSignup));


router.route("/login")
.get( wrapAsync(userController.renderFormForUserLogin))
.post( redirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.userLogin))

router.get("/logout", userController.userLogout);

module.exports = router;