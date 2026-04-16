const express = require("express");
const router = new express.Router();

const adminAuthController = require("./../../controllers/admin/adminControllers");
const adminUpload = require("./../../multerconfig/admin/adminStorageConfig");
const adminauthenticate = require("../../middleware/admin/adminauthenticate");

router.post(
  "/register",
  adminUpload.single("admin_profile"),
  adminAuthController.Register,
);

router.post("/login", adminAuthController.Login);
router.get("/adminverify", adminauthenticate, adminAuthController.AdminVerify);
router.get("/logout", adminauthenticate, adminAuthController.Logout);

module.exports = router;