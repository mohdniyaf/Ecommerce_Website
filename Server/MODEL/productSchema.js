const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,  // Referencing Category model
        ref: 'Category',  // Refer to the Category model
        required: true
    },
    subCategory: {  // Shirt or Pant
        type: String,
        enum: ['Shirt', 'Pant'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    size: {  // Sizes like Small, Medium, Large
        type: [String],  // Array of sizes
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],  // Valid sizes
        required: true
    },
    images: [
        {
          url: {
            type: String,
            required: true,  
              
          },
          altText: {
            type: String,
          },
          caption: {
            type: String,
          },
        },
      ],
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});


const Product = mongoose.model('Product', productSchema);

module.exports =  Product ;
