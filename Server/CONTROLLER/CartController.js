const Cart = require('../MODEL/cartSchema');
const Product = require('../MODEL/productSchema');

// Get Cart for a specific user
const getCart = async (req, res) => {
  const userId = req.user._id; // Ensure using consistent _id

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cart', error });
  }
};

// Add product to Cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // Assuming user is authenticated

  try {
    // Find the product to ensure it exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
        totalAmount: product.price * quantity,
      });
    } else {
      // Check if the product already exists in the cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      
      if (itemIndex > -1) {
        // If product exists, update the quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // If product doesn't exist, add it to the cart
        cart.items.push({ product: productId, quantity });
      }

      // Update the total amount
      cart.totalAmount += product.price * quantity;
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });

  } catch (error) {
    res.status(500).json({ message: 'Error adding product to cart', error });
  }
};

// Delete product from Cart
const deleteFromCart = async (req, res) => {
  const  productId  = req.params.id;
  const userId = req.user._id;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    console.log(productId);
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the product in the cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Get product price from the product model (to ensure price integrity)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate the price to be deducted
    const itemQuantity = cart.items[itemIndex].quantity;
    const productPrice = product.price * itemQuantity; // Correct calculation

    // Deduct from the totalAmount
    cart.totalAmount -= productPrice;

    // Ensure totalAmount does not go negative
    if (cart.totalAmount < 0) cart.totalAmount = 0;

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    await cart.save();
    return res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return res.status(500).json({ message: 'Error removing product from cart', error });
  }
};

module.exports = { addToCart, deleteFromCart, getCart };
