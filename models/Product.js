import mongoose from "mongoose";

const storeItemSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: Number,
      required: true,
      min: 0,
    },
    imgUrls: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    sale: {
      type: Boolean,
      default: false,
    },
    newArival: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      default: true,
    },
    store: {
      type: [storeItemSchema],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const Product = mongoose.models.product || mongoose.model("product", productSchema);

export default Product;
