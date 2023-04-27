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

router.get("/delete", controller.delete_get);

router.get("/edit", controller.edit_get);

router.get("/veileder", controller.veileder_get);

    // post
router.post("/signup", cors(), controller.signup_post);

router.post("/login", cors(), controller.login_post);

router.post("/addProduct", cors(), controller.addProduct_post);

router.post("/delete", controller.delete_post);

router.post("/edit", controller.edit_post);

    // 404
router.use(controller.error404);

// export
module.exports = router;