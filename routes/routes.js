// imports
const controller = require("../controllers/controller");
const { Router } = require("express");
const cors = require("cors");

// router init
const router = Router();

// routes
    // get
router.get("/", controller.home_get);

router.get("/signup", controller.signup_get);

router.get("/login", controller.login_get);

router.get("/addProduct", controller.addProduct_get);

    // post
router.post("/signup", cors(), controller.signup_post);

router.post("/login", cors(), controller.login_post);

router.post("/addProduct", cors(), controller.addProduct_post);

    // 404
router.use(controller.error404);

// export
module.exports = router;