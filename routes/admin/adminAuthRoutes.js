const express = require("express");
const router = new express.Router();
const adminauthenticate = require("../../middleware/admin/adminauthenticate");

const adminAuthcontroller = require('../../controllers/admin/adminControllers');
const adminUpload = require("../../multerconfig/admin/adminStorageConfig");

//admin auth routes
router.post("/register", adminUpload.single("admin_profile"), adminAuthcontroller.Register);
router.post("/login", adminAuthcontroller.login);
router.get("/logout", adminauthenticate, adminAuthcontroller.logout);

//admin verify
router.get("/adminverify", adminauthenticate, adminAuthcontroller.AdminVerify)


module.exports = router