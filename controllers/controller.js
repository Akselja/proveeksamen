// import
const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// dotenv init
dotenv.config({ path : "../.env" });

// controllers
   // get
module.exports.home_get = (req, res) => {
    if (req.cookies.jwt) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("home", { email : decoded.email });
    } else {
        res.render("home");
    } 
}

module.exports.signup_get = (req, res) => {
    if (req.cookies.jwt) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("signup", { email : decoded.email });
    } else {
        res.render("signup");
    } 
}

module.exports.login_get = (req, res) => {
    if (req.cookies.jwt) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("login", { email : decoded.email });
    } else {
        res.render("login");
    } 
    
}

module.exports.addProduct_get = (req, res) => {
    try {
        const jwtAuth = req.cookies.jwt;
        const decoded = jwt.verify(jwtAuth, process.env.secretKey);
        if (decoded.email === "petter.shoes@kickshub.io") {
            res.status(200).render("addProduct", { email : decoded.email });
        } else {
            res.status(401).render("accessDenied");
        }
    } catch (err) {
        res.status(401).render("accessDenied");
    }
}

   // post
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        console.log("goof")
        const user = await User.create({ email, password });
        const token = createJWT(user.email);
        if(user) {
            res.status(201).cookie("jwt", token, {maxAge : 604800000, httpOnly : true}).redirect("/");
        }
        
    } catch (err) {
        res.status(400).json({ error : err });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        const user = await User.login( email, password );
        const token = createJWT(user.email);
        if(user) {
            res.status(201).cookie("jwt", token, {maxAge : 604800000, httpOnly : true}).json({ user: user.email });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ error : err });
    }
}

module.exports.addProduct_post = async (req, res) => {
    const {
        artikkelnummer, modell, merke, pris, tittel
    } = req.body;

    const dato = new Date();

    try {
        console.log(req.body);
        console.log(artikkelnummer, modell, merke, pris, tittel, dato)
        const product = await Product.create({
            artikkelnummer,
            modell,
            merke,
            pris,
            tittel,
            dato
        });
        console.log(product);
        res.status(201).json({ product });
    } catch (err) {
        console.log(err)
        res.status(400).json({ error : err });
    }
}

   // 404
module.exports.error404 = (req, res) => {
   res.render('404');
}


// JWT creation
const createJWT = (email) => {
    const secretKey = process.env.secretKey;
    const payload = {
        email
    }
    const newToken = jwt.sign(payload, secretKey, {
        algorithm : "HS256",
        expiresIn : "7d"
    })

    return newToken;
}