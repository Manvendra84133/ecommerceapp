const categorydb = require("./../../model/product/productCategoryModel");
const cloudinary = require("./../../Cloudinary/cloudinary")
const productsdb = require("./../../model/product/ProductModel")

exports.addCategory = async (req, res) => {
  const { categoryname, description } = req.body;

  if (!categoryname || !description) {
    return res.status(400).json({ error: "Fill all details" });
  }

  try {
    const existingcategory = await categorydb.findOne({ categoryname });

    if (existingcategory) {
      return res.status(400).json({ error: "This category already exists" });
    }

    const addCategory = new categorydb({ categoryname, description });
    await addCategory.save();

    return res.status(201).json(addCategory);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const getAllcategory = await categorydb.find({});
    res.status(200).json(getAllcategory);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.AddProducts = async (req, res) => {
  try {
    const { productname, price, discount, quantity, description, categoryid } = req.body;
    const file = req.file ? req.file.path : "";

    if (!productname || !price || !discount || !quantity || !description || !categoryid) {
      return res.status(400).json({ error: "Fill all details" });
    }

    const upload = await cloudinary.uploader.upload(file);

    const existingProduct = await productsdb.findOne({ productname });

    if (existingProduct) {
      return res.status(400).json({ error: "This product already exists" });
    }

    const addProduct = new productsdb({
      productname,
      price,
      discount,
      quantity,
      description,
      categoryid,
      productimage: upload.secure_url
    });

    await addProduct.save();

    return res.status(201).json(addProduct);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {

  const categoryid = req.query.categoryid || ""
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = 8;

  console.log("page", page);
  console.log("categoryid", categoryid);
  
  const query = {}

  if (categoryid !== "all" && categoryid) {
    query.categoryid = categoryid
  }

  try {
    const skip = (page - 1) * ITEM_PER_PAGE
    
    const count = await productsdb.countDocuments(query);

    const getAllProducts = await productsdb.find(query)
      .limit(ITEM_PER_PAGE)
      .skip(skip);
    
    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    res.status(200).json({
      getAllProducts,
      Pagination: {
        totalProducts: count,
        pageCount
      }
    })
  }
  catch (error) {
    res.status(400).json(error);
  }
}

exports.getSingleProduct = async (req, res) => {
  const { productid } = req.params;
  
  try {
    const getSingLeProductdata = await productsdb.findOne({ _id: productid });
    res.status(200).json(getSingLeProductdata)
  }
  catch (error) {
    res.status(400).json(error);     
  }
}

exports.DeleteProducts = async (req, res) => {
  const { productid } = req.params;

  try {
    const deleteProducts = await productsdb.findByIdAndDelete({ _id: productid })
    res.status(200).json(deleteProducts)
  }
  catch (error) {
     res.status(400).json(error)
  }
}

exports.getLatestProducts = async (req, res) => {
  try {
    const getNewProducts = await productsdb.find().sort({ _id: -1 });
    res.status(200).json(getNewProducts)
  }
  catch (error) {
    res.status(400).json(error)
  }
}