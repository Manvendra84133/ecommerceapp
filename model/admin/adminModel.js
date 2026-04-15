const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "ADMIN_SECRET_KEY";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10
  },
  password: {
    type: String,
    required: true
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

adminSchema.methods.generateAuthToken = async function () {
  try {
    let newtoken = jwt.sign(
      { _id: this._id },
      SECRET_KEY,
      {
        expiresIn: "1d"
      }
    );

    this.tokens = this.tokens.concat({ token: newtoken });
    await this.save();

    return newtoken;
  }
  catch (error) {
    throw error;
  }
};

const adminDB = new mongoose.model("admins", adminSchema);
module.exports = adminDB;