const jwt = require("jsonwebtoken");
const adminDB = require("../../model/admin/adminModel");

const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "ADMIN_SECRET_KEY";

const adminauthenticate = async (req, res, next) => {
  console.log("admin authenticate called");

  try {
    const token = req.headers.authorization;
    console.log("token is", token);

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const tokenVerify = jwt.verify(token, SECRET_KEY);
    console.log("verify token is", tokenVerify);

    const rootUser = await adminDB.findOne({ _id: tokenVerify._id });

    if (!rootUser) {
      return res.status(401).json({ error: "User not found" });
    }

    const index = rootUser.tokens.findIndex(
      (element) => element.token === token
    );

    console.log("index is", index);

    if (index === -1) {
      return res.status(401).json({ error: "User already logged out" });
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();

  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = adminauthenticate;