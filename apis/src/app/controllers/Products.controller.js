import mongoose from "mongoose";
import Product from "../models/Product/Product.model.js";

export const CreateProduct = async (req, res) => {
  const responseType = {};
  const input = req.body;
  try {
    const newEval = new Product({
      Name: input.Name,
      Image: input.Image,
      Describe: input.Describe,
      Price: input.Price,
      Category: input.Category,
    });
    const save = await newEval.save();
    responseType.message = "Create Product successfully";
    responseType.status = 200;
    responseType.value = save;
  } catch (error) {
    responseType.status = 404;
    responseType.message = "Create Productfailed";
  }
  res.json(responseType);
};


// Get all products or products matching the keyword
export const GetAllProducts = async (req, res) => {
  const responseType = {};
  try {
    const keyword = req.query.Keyword; 
    if (keyword) {
      // Nếu có keyword, thực hiện tìm kiếm
      const regexPattern = new RegExp(keyword, 'i');
      const data = await Product.find({ Name: regexPattern });
      responseType.message = "Get successfully with keyword";
      responseType.status = 200;
      responseType.value = data;
    } else {
      // Nếu không có keyword, lấy tất cả sản phẩm
      const data = await Product.find();
      responseType.message = "Get all products successfully";
      responseType.status = 200;
      responseType.value = data;
    }
  } catch (err) {
    responseType.statusText = "Error";
    responseType.message = "Get Failed ";
    responseType.status = 404;
  }

  res.json(responseType);
};
export const GetProductById = async (req, res) => {
  const responseType = {};
  try {
    const { id } = req.params;
    const data = await Product.findById(id);
    responseType.message = "Get successfully";
    responseType.status = 200;
    responseType.value = data;
  } catch (err) {
    responseType.statusText = "Error";
    responseType.message = "Get Failed ";
    responseType.status = 404;
  }
  res.json(responseType);
};

export const DeleteProduct = async (req, res) => {
  const responseType = {};
  // check input
  try {
    const data = await Product.findByIdAndDelete({ _id: req.params.id });
    responseType.message = "Delete successfully";
    responseType.status = 200;
    responseType.value = data;
  } catch (err) {
    responseType.statusText = "Error";
    responseType.message = "Delete Failed ";
    responseType.status = 404;
  }
  res.json(responseType);
};

export const UpdateProduct = async (req, res) => {
  const responseType = {};
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    const save = await product.save();
    responseType.message = "Update successfully";
    responseType.status = 200;
    responseType.value = save;
  } catch (err) {
    responseType.message = "Update failed";
    responseType.status = 500;
  }
  res.json(responseType);
};

