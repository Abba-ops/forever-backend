import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../utilities/index.js";
import productModel from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    longDesc,
    shortDesc,
    price,
    category,
    subCategory,
    sizes,
    bestseller,
  } = req.body;

  const image1 = req.files.image1 && req.files.image1[0];
  const image2 = req.files.image2 && req.files.image2[0];
  const image3 = req.files.image3 && req.files.image3[0];
  const image4 = req.files.image4 && req.files.image4[0];

  const images = [image1, image2, image3, image4].filter(
    (image) => image !== undefined
  );

  let imagesUrl = await Promise.all(
    images.map(async (item) => {
      let result = await cloudinary.uploader.upload(item.path, {
        resource_type: "image",
      });
      return result.secure_url;
    })
  );

  const productData = {
    name,
    category,
    price: Number(price),
    subCategory,
    bestseller: Boolean(bestseller),
    sizes: JSON.parse(sizes),
    image: imagesUrl,
    shortDesc,
    longDesc,
  };

  const product = new productModel(productData);
  await product.save();

  res.status(201).json({
    success: true,
    data: product,
    message: "Product created successfully",
  });
});

const listProducts = asyncHandler(async (req, res) => {
  const products = await productModel.find({});

  res.status(200).json({
    success: true,
    data: products,
    message: "Products retrieved successfully",
  });
});

const removeProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.json({ success: true, message: "Product deleted successfully" });
});

const singleProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    success: true,
    data: product,
    message: "Product retrieved successfully",
  });
});

export { addProduct, listProducts, removeProduct, singleProduct };
