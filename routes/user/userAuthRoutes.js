const express = require("express");
const router = new express.Router();

const userAuthController = require("./../../controllers/user/userController");
const userUpload = require("./../../multerconfig/user/userStorageConfig");
const userauthenticate = require("../../middleware/user/userauthenticate");

router.post("/register", userUpload.single("user_profile"), userAuthController.Register,);

router.post("/login", userAuthController.Login);
router.get("/userverify", userauthenticate, userAuthController.userVerify);
router.get("/logout", userauthenticate, userAuthController.logout);

module.exports = router;