const jwt = require("jsonwebtoken");
const userDB = require("../../model/user/userModel");
const SECRET_KEY = process.env.USER_SECRET_KEY || "USER_SECRET_KEY";

const userauthenticate = async (req, res, next) => {
  console.log("user authenticate called");
  try {
    const token = req.headers.authorization;
    console.log("token is", token);

    const tokenVerify = jwt.verify(token, SECRET_KEY);
    console.log("verify token is", tokenVerify);

    const rootUser = await userDB.findOne({ _id: tokenVerify._id });
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
    req.userMainId = rootUser.id;

    next();
  } catch (error) {
    res.status(400).json({ error: "Unauthorized no Token provide !!" });
  }
};

module.exports = userauthenticate;