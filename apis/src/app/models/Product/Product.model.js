import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    Name: {
      type: String,
    },
    Image: {
      type: [String],
    },
    Describe: {
      type: String,
    },
    Price: {
      type: String,
    },
    Category: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Products", ProductSchema);
export default Product;
