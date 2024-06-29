const User = require("../models/user.js");

module.exports.renderFormForUserSignup = async (req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.userSignup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        })

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

module.exports.renderFormForUserLogin = async (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.userLogin = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    //this is done for preventing unsigned users to delete reviews
    const pattern = /\/listings\/[\w\d]+\/reviews\/[\w\d]+\?_method=delete/;

    // If redirectUrl matches the pattern, set it to "/listings"
    if (pattern.test(redirectUrl)) {
        redirectUrl = "/listings";
    }
    res.redirect(redirectUrl);
}

module.exports.userLogout = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    })

}