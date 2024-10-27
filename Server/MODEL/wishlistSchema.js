const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const WishlistSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product', 
            required: true,
        }
    }]
})

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
module.exports =  Wishlist ;

