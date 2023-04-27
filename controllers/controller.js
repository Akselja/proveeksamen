// import
const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// dotenv init
dotenv.config({ path : "../.env" });

// controllers
   // get
module.exports.home_get = async (req, res) => {
    // get products from DB
    const products = await getProducts();
    // try to connect to home
    if (req.cookies.jwt) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("home", { email : decoded.email, products });
    } else {
        res.render("home", { products });
    }   
}

module.exports.signup_get = (req, res) => {
    // try to connect to signup
    if (req.cookies.jwt) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("signup", { email : decoded.email });
    } else {
        res.render("signup");
    } 
}

module.exports.login_get = (req, res) => {
    // try to connect to login
    if (req.cookies.jwt) {
        const cookie = req.cookies.jwt;
        const decoded = jwt.verify(cookie, process.env.secretKey);
        res.render("login", { email : decoded.email });
    } else {
        res.render("login");
    }
}

module.exports.addProduct_get = (req, res) => {

    // try to connect to addProduct (auth protected)
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

module.exports.delete_get = (req, res) => {

    // try to connect to delete (auth protected)
    try {
        const jwtAuth = req.cookies.jwt;
        const decoded = jwt.verify(jwtAuth, process.env.secretKey);
        if (decoded.email === "petter.shoes@kickshub.io") {
            res.status(200).render("delete", { email : decoded.email });
        } else {
            res.status(401).render("accessDenied");
        }
    } catch (err) {
        res.status(401).render("accessDenied");
    }
}

module.exports.edit_get = (req, res) => {

    // try to connect to edit (auth protected)
    try {
        const jwtAuth = req.cookies.jwt;
        const decoded = jwt.verify(jwtAuth, process.env.secretKey);
        if (decoded.email === "petter.shoes@kickshub.io") {
            res.status(200).render("edit", { email : decoded.email });
        } else {
            res.status(401).render("accessDenied");
        }
    } catch (err) {
        res.status(401).render("accessDenied");
    }
}

module.exports.veileder_get = (req, res) => {

    // try to connect to veileder (auth protected)
    try {
        const jwtAuth = req.cookies.jwt;
        const decoded = jwt.verify(jwtAuth, process.env.secretKey);
        if (decoded.email === "petter.shoes@kickshub.io") {
            res.status(200).render("veileder", { email : decoded.email });
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
    
    // try signup
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

    // try login
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

    // attempt adding product to DB (auth protected)
        // auth
    try {
        const jwtAuth = req.cookies.jwt;
        const decoded = jwt.verify(jwtAuth, process.env.secretKey);
        if (decoded.email === "petter.shoes@kickshub.io") {
                // add to db
            try {
                console.log(req.body);
                console.log(artikkelnummer, modell, merke, pris, tittel)
                const product = await Product.create({
                    artikkelnummer,
                    modell,
                    merke,
                    pris,
                    tittel
                });
                console.log(product);
                res.status(201).redirect("/addProduct");
            } catch (err) {
                console.log(err)
                res.status(400).json({ error : err });
            }
        } else {
            res.status(401).render("accessDenied");
        }
    } catch (err) {
        res.status(401).render("accessDenied");
    }
}

module.exports.delete_post = async (req, res) => {
    const { artikkelnummer } = req.body;
    console.log(artikkelnummer);
    // attempt delete (auth protected)
    try {
        const jwtAuth = req.cookies.jwt;
        const decoded = jwt.verify(jwtAuth, process.env.secretKey);
        if (decoded.email === "petter.shoes@kickshub.io") {
            const deletedProd = await Product.findOneAndDelete(artikkelnummer);
            res.status(200).redirect("/delete");
        } else {
            res.status(401).render("accessDenied");
        }
    } catch (err) {
        console.log(err);
        res.status(400).redirect("/delete");
    }
}

module.exports.edit_post = (req, res) => {
    const request = req.body;

    const filter = request.artikkelnummer;
    delete request.artikkelnummer;
    const update = {};

    // filters out empty values, because they are submittable in this request
    Object.entries(request).forEach((entry) => {
        if (!entry[1] == "") {
            if (entry[0] === "chartikkelnummer") {
                update["artikkelnummer"] = entry[1];
            } else {
                update[entry[0]] = entry[1];

            }
        }
    })

    // attempt update (auth protected)
    try {
        const jwtAuth = req.cookies.jwt;
        const decoded = jwt.verify(jwtAuth, process.env.secretKey);
        if (decoded.email === "petter.shoes@kickshub.io") {
            const updatedProd = Product.findOneAndUpdate(filter, update);
            res.status(200).redirect("/edit");
        } else {
            res.status(401).render("accessDenied");
        }
    } catch (err) {
        console.log(err);
        res.status(400).redirect("/edit");
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


// function sorting products by time
const getProducts = async () => {
    // gets products and sorts them
    const productList = await Product.find({}).sort({ createdAt : -1 });
    // returns sorted products
    return productList;
}
