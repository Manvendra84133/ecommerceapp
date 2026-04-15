require('dotenv').config()

const express = require("express")
const cors = require("cors")
require("./db/conn")

const app = express()
const port = 4009

app.use(cors())
app.use(express.json());

//admin routes
const adminAuthroutes = require("./routes/admin/adminAuthRoutes")
app.use("/adminauth/api", adminAuthroutes);



app.get('/', (req, res) => {
  res.status(200).json({ message: "server start" })
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})