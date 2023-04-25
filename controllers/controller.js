// import
const User = require("../models/User");

// controllers
   // get
module.exports.home_get = (req, res) => {
    res.render("home");
}

module.exports.signup_get = (req, res) => {
    res.render("signup");
}

module.exports.login_get = (req, res) => {
    res.render("login");
}

   // post
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        res.status(201).json({ user : user.email });
    } catch (err) {
        res.status(400).json({ error : err });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login({ email, password });
        res.status(201).json({ user: user.email });
    } catch (err) {
        res.status(400).json({ error : err });
    }
}

   // 404
module.exports.error404 = (req, res) => {
   res.render('404');
}