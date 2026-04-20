const adminDB = require("../../model/admin/adminModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../../Cloudinary/cloudinary");

exports.Register = async (req, res) => {
  console.log("admin router /register api called");
  console.log("req body is => ", req.body);
  console.log("req file is => ", req.file);

  const { name, email, password, mobile, confirmpassword } = req.body;

  if (!name || !email || !password || !mobile || !confirmpassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ error: "password & confirm pasword dont match !!" });
  }

  const file = req.file?.path;
  const upload = await cloudinary.uploader.upload(file);

  const hashPassword = await bcrypt.hash(password, 12);

  try {
    const preUser = await adminDB.findOne({ email: email });
    const mobileVerfiy = await adminDB.findOne({ mobile: mobile });

    if (preUser) {
      return res.status(400).json({ error: "This admin is already exists !!" });
    }
    else if (mobileVerfiy) {
      return res.status(400).json({ error: "Mobile already exists !!" });
    }
    else {
      const adminData = new adminDB({
        name,
        email,
        password: hashPassword,
        mobile,
        profile: upload.secure_url,
      });

      await adminData.save();
      res.status(200).json(adminData);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.Login = async (req, res) => {
  console.log("login api hitted successfully");

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const adminValid = await adminDB.findOne({ email: email });
    console.log("Admin is=> ", adminValid);

    if (adminValid) {
      const isMatch = await bcrypt.compare(password, adminValid.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      } else {
        const token = await adminValid.generateAuthToken();

        const result = {token, adminValid,};

        res.status(200).json(result);
      }
    } else {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.AdminVerify = async (req, res) => {
  try {
    const verifyAdmin = await adminDB.findOne({ _id: req.userId });
    res.status(200).json(verifyAdmin);
    console.log("Admin verified success");
  }
  catch (error) {
    console.log("error in admin verification=> ", error);
    res.status(400).json({ error: "Error in admin verification" });
  }
};

exports.Logout = async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((element) => {
      return element.token !== req.token;
    });

    await req.rootUser.save();

    res.status(200).json("Logout successful !!");
  } catch (error) {
    console.log("error in logout => ", error);
  }
};