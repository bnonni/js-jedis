var express = require("express"); //require middleware
var router = express.Router(); //import router
const User = require("../models/user"); //require mongoose connection & model

/* Get home page */
router.get("/", (req, res, next) => {
    res.render("index");
});

router.get("/game", (req, res) => {
    res.render("game");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("login");
});

router.get("/leaderboard", (req, res) => {
    res.render("leaderboard");
});

router.get("/logout", (req, res) => {
    var logout = res.clearCookie(req.body.log_username + "Data", req.user);
    console.log(logout);
    res.render("login", { logout_msg: "You've successfully logged out! See you soon!" });
});

router.post("/login", (req, res) => {

    var username = req.body.log_username;
    var userpass = req.body.log_password

    var login = {
        uname: username,
        pass: userpass
    }
    console.log(login);

    User.findOne({ "username": username }, (err, user) => {
        if (user == null) {
            console.log(err);
            res.render("login", { login_fail_msg: "Login failed! Username not found. Please register for an account!" });
        } else if (userpass != user.password) {
            console.log(user);
            res.render("login", { login_fail_msg: "Password Invalid! Please try again." });
        } else if ((!err) && (userpass == user.password)) {
            res.redirect(302, "/game");
        }
    })
});

router.post("/register", (req, res) => {
    // Get our form values
    var name = req.body.name;
    var username = req.body.reg_username;
    var email = req.body.email;
    var password = req.body.reg_password2;

    //Create new mongoose schema
    var user = new User({ name, email, username, password });

    //Save user to db
    user.save()
        .then(item => {
            res.render("login", { register_success_msg: "Registration Successful! Please login!" });
            console.log(item + " saved to Database!")
        })
        .catch(err => {
            res.render("login", { register_fail_msg: "Registration failed! Please try again!" });
            console.log("Error saving to database " + err);
        });
});

module.exports = router;