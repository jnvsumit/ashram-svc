const router = require("express").Router();
const user = require("./user");
const auth = require("./auth");
const book = require("./book");
const page = require("./page");
const video = require("./video");
const communication = require("./communication");
const order = require("./order");
const currency = require("./currency");
const donor = require("./donor");

router.use("/user", user);
router.use("/auth", auth);
router.use("/book", book);
router.use("/page", page);
router.use("/video", video);
router.use("/communication", communication);
router.use("/order", order);
router.use("/currency", currency);
router.use("/donor", donor);

module.exports = router;
