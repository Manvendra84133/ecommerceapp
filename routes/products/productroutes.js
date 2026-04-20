const express = require('express')
const router = new express.Router();

const adminauthenticate = require("./../../middleware/admin/adminauthenticate")
const productController = require("./../../controllers/product/productController")
const productUpload = require("./../../multerconfig/products/productStorageConfig")

// product category routes
router.post("/addcategory", adminauthenticate, productController.addCategory)
router.get("/getcategory", productController.getCategory);

// product routes
router.post("/addProducts", [adminauthenticate, productUpload.single("productimage")], productController.AddProducts);
router.get("/getProducts", productController.getAllProducts)

module.exports = router;