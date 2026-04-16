const jwt = require("jsonwebtoken");
const adminDB = require("../../model/admin/adminModel");
const SECRET_KEY = process.env.USER_SECRET_KEY || "USER_SECRET_KEY";

const adminauthenticate = async (req, res, next) => {
  console.log("admin authenticate called");
  try {
    const token = req.headers.authorization;
    console.log("token is", token);

    const tokenVerify = jwt.verify(token, SECRET_KEY);
    console.log("verify token is", tokenVerify);

    const rootUser = await adminDB.findOne({ _id: tokenVerify._id });
    console.log("root user is", rootUser);

    const index = rootUser.tokens.findIndex(
      (element) => element.token === token,
    );
    console.log("index is", index);

    if (index === -1) {
      return res.status(400).json({ error: "Token not found !!" });
    }

    if (!rootUser) {
      throw new Error("User not found !!");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();
  } catch (error) {
    res.status(400).json({ error: "Unauthorized no Token provide !!" });
  }
};

module.exports = adminauthenticate;