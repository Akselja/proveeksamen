// imports
const controller = require("../controllers/controller");
const { Router } = require("express");

// router init
const router = Router();

// routes
    // get
router.get("/", controller.home_get);

router.get("/signup", controller.signup_get);

router.get("/login", controller.login_get);

router.get("/addProduct", controller.addProduct_get);

    // post
router.post("/signup", controller.signup_post);

router.post("/login", controller.login_post);

    // 404
router.use(controller.error404);

// export
module.exports = router;