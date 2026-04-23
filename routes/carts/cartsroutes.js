const express = require('express')
const router = new express.Router()

const cartControllers = require("./../../controllers/carts/cartsControllers")
const userauthenticate = require("./../../middleware/user/userauthenticate")

// carts routes 
router.post("/addtocart/:id", userauthenticate, cartControllers.AddtoCart)
//router.get("/getcarts", userauthenticate, cartControllers.getCartsValue)
//router.delete("/removesingleitem/:id", userauthenticate, cartControllers.removeAllitem)

//delete carts data when order done
//router.delete("/removecartdata", userauthenticate, cartControllers.removeAllitem)

module.exports = router