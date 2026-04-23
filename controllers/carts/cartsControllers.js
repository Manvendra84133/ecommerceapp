const productsdb = require("./../../model/product/ProductModel")
const cartsdb = require("./../../model/carts/cartsModel")

exports.AddtoCart = async (req, res) => {
  const { id } = req.params;

  try {
    const productfind = await productsdb.findOne({ _id: id });

    const carts = await cartsdb.findOne({
      userid: req.userId,
      productid: productfind._id
    });

    if (productfind?.quantity >= 1) {

      if (carts?.quantity >= 1) {
        carts.quantity = carts.quantity + 1;
        await carts.save();

        productfind.quantity = productfind.quantity - 1;
        await productfind.save();

        return res.status(200).json({
          message: "Product successfully incremented in your cart"
        });
      } else {
        const addtocart = new cartsdb({
          userid: req.userId,
          productid: productfind._id,
          quantity: 1
        });

        await addtocart.save();

        productfind.quantity = productfind.quantity - 1;
        await productfind.save();

        return res.status(200).json({
          message: "Product successfully added in your cart"
        });
      }

    } else {
      return res.status(400).json({
        message: "This product is sold out"
      });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};