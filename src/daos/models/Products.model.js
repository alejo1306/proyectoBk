import { Schema, model } from 'mongoose';


const productSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
    category: String
});

const ProductModel = model('Product', productSchema);

export { ProductModel };