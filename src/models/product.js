import mongoose from "mongoose";

const  productSchema = new mongoose.Schema({
    id: String,
  name: String,
  gender: String,
  category: String,
  price: {
    original: Number,
    offer: Number,
  },
  rating: Number,
  ratingCount: Number,
  sizes: [String],
  material: [String],
  pattern: [String],
  sleeves: [String],
  color: [String],
  occasion: [String],
  overview: String,
  description: [String],
  care: [String],
  images: [String],
  tags: [String],
  productNote: String, 
 

})
const Product = mongoose.model('Product',productSchema,'item')

export default Product;