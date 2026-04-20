require('dotenv').config()

const express = require("express")
const cors = require("cors")
require("./db/conn")

const app = express()
const port = 4009

app.use(cors())
app.use(express.json());

//ADMIN ROUTES
const adminAuthRoutes = require("./routes/admin/adminAuthRoutes")
app.use("/adminauth/api", adminAuthRoutes);

//USER ROUTES
const userAuthRoutes = require("./routes/user/userAuthRoutes")
app.use("/userauth/api", userAuthRoutes);

//PRODUCT ROUTES
const productroutes = require("./routes/products/productroutes")
app.use("/product/api", productroutes)

// DEFAULT ROUTE
app.get('/', (req, res) => {
  res.status(200).json({ message: "server start" })
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})