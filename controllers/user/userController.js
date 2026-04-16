const userDB = require("../../model/user/userModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../../Cloudinary/cloudinary");

exports.Register = async (req, res) => {
  console.log("admin router /register api called");
  console.log("req body is => ", req.body);
  console.log("req file is => ", req.file);
  
  const { firstname, email, password, confirmpassword, lastname } = req.body;
  
  if (!firstname || !email || !password || !confirmpassword || !lastname) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Image is required" });
  }
  
  const file = req.file?.path;
  const upload = await cloudinary.uploader.upload(file);
  console.log("upload file is=> ", upload);

  const hashPassword = await bcrypt.hash(password, 12);

  try {
    const preUser = await userDB.findOne({ email: email });
    if (preUser) {
      res.status(400).json({ error: "This user already exists !!" });
    }
    else if (password !== confirmpassword) {
      res.status(400).json({ error: "password & confirm pasword dont match !!" });
    }
    else {
      const userData = new userDB({
        firstname,
        lastname,
        email,
        password: hashPassword,
        userprofile: upload.secure_url,
      });
      await userData.save();
      res.status(200).json(userData);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.Login = async (req, res) => {
  console.log("login api hitted successfully");
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: "All fields are required" });
  }
  
  try {
    const userValid = await userDB.findOne({ email: email });
    console.log("User is=> ", userValid);

    if (userValid) {
      const isMatch = await bcrypt.compare(password, userValid.password);
      
      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials" });
      } else {
        const token = await userValid.generateAuthToken();
        const result = {
          token,
          userValid,
        };
        res.status(200).json(result);
      }
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.userVerify = async (req, res) => {
  try {
    const verifyAdmin = await userDB.findOne({ _id: req.userId });
    res.status(200).json(verifyAdmin);
    console.log("Admin verified success");
  } catch (error) {
    console.log("error in admin verification=> ", error);
  }
};

exports.logout = async (req, res) => {
  try {
    const tokenIndex = req.rootUser.tokens.findIndex(
      (element) => element.token === req.token
    );

    if (tokenIndex === -1) {
      return res.status(400).json({ message: "User already logged out" });
    }

    req.rootUser.tokens = req.rootUser.tokens.filter(
      (element) => element.token !== req.token
    );

    await req.rootUser.save();

    res.status(200).json("Logout successful !!");
  } catch (error) {
    console.log("error in logout => ", error);
  }
};