const mongoose = require("mongoose")

const DBURL = process.env.DATABASE

mongoose
  .connect(DBURL, {
  })
  .then(() => {
    console.log("MongoDB connected successfully")
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message)
  })