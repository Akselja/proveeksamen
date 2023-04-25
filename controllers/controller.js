// import
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// dotenv init
dotenv.config();

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

module.exports.addProduct_get = (req, res) => {
    try {
        console.log("hola")
        const jwtAuth = req.cookies.jwt;
        console.log(jwtAuth)
        const decoded = jwt.verify(jwtAuth, process.env.secretKey);
        console.log(decoded)
        if (decoded.email === "petter.shoes@kickshub.io") {
            console.log("hola")
            res.render("addProduct");
        } else {
            console.log("hola")
            res.render("accessDenied");
        }
    } catch (err) {
        res.status(400).json({ error : err });
    }
}

   // post
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.create({ email, password });
        const token = createJWT(user.username);
        if(user) {
            res.status(201).cookie("jwt", token, {maxAge : 604800, httpOnly : true}).redirect("/");
        }
        
    } catch (err) {
        res.status(400).json({ error : err });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login({ email, password });
        const token = createJWT(user.email);
        if(user) {

        }
        res.status(201).json({ user: user.email });
    } catch (err) {
        res.status(400).json({ error : err });
    }
}

   // 404
module.exports.error404 = (req, res) => {
   res.render('404');
}


// JWT creation
const createJWT = (email) => {
    console.log("goof")
    const secretKey = process.env.secretKey;
    const payload = {
        email
    }
    console.log("ball")
    const newToken = jwt.sign(payload, secretKey, {
        algorithm : "HS256",
        expiresIn : "7d"
    })
    console.log("er")

    return newToken;
}