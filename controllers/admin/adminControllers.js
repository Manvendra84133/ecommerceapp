const adminDB = require('../../model/admin/adminModel');
const cloudinary = require('../../Cloudinary/cloudinary');
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

exports.Register = async (req, res) => {
  console.log("admin route called\nregister api called");
  console.log("req body is", req.body);
  console.log("req file is", req.file);
  
  const { name, email, mobile, password, confirmpassword } = req.body;

  console.log("name is", name);
  console.log("email is", email);
  console.log("mobile is", mobile);
  console.log("password is", password);
  
  if (!name || !email || !mobile || !password || !confirmpassword) {
    return res.status(400).json({ error: "All fields required" });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ error: "Password and confirm password do not match" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "File is required" });
  }

  try {
    const preuser = await adminDB.findOne({ email: email });
    const mobileverification = await adminDB.findOne({ mobile: mobile });

    if (preuser) {
      return res.status(400).json({ error: "This admin already exist" });
    }
    else if (mobileverification) {
      return res.status(400).json({ error: "This mobile already exist" });
    }
    else {
      const hashPassword = await bcrypt.hash(password, 10);
      console.log("hashpassword is", hashPassword);

      const file = req.file.path;
      const upload = await cloudinary.uploader.upload(file);

      console.log('file path is', file);
      console.log("upload url is", upload.url);

      const adminData = new adminDB({
        name,
        email,
        mobile,
        password: hashPassword,
        profile: upload.secure_url
      });

      console.log("admindata", adminData);
      
      await adminData.save();
      return res.status(200).json(adminData);
    }
  }

  catch (error) {
    return res.status(400).json(error);
  }
};


exports.login = async (req, res) => {
  console.log("Login api hitted or requested");
  const { email, password } = req.body;
  console.log("request body is", req.body);

  if (!email || !password) {
    return res.status(400).json({ error: "All feilds required" });
  }

  try {
    const adminValid = await adminDB.findOne({ email: email });
    console.log('admin is', adminValid);
    
    if (adminValid) {
      const isMatch = await bcrypt.compare(password, adminValid.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      } else {
        
        const token = await adminValid.generateAuthToken();
        console.log("hello")

        const result = {
          adminValid,
          token
        };

        return res.status(200).json({ result });
      }
    } else {
      return res.status(400).json({ error: "Invalid data" });
    }

  } catch (error) {
    return res.status(400).json(error);
  }
}

exports.AdminVerify = async (req, res) => {
  console.log("request root user is", req.rootUser);
  
  const verifyAdmin = await adminDB.findOne({ _id: req.userId });
 res.status(200).json(verifyAdmin)
}

exports.logout = async (req, res) => {
  try {
     const token = req.token;

    req.rootUser.tokens = req.rootUser.tokens.filter((elem) => elem.token !== token);

    await req.rootUser.save();
    return res.status(200).json({message: "Logout successful"});
}
  
  catch (error) {
    return res.status(500).json({
      error: "Logout failed",
      message: error.message
    });
  }
};