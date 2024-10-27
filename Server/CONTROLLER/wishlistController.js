const Wishlist = require('../MODEL/wishlistSchema');

// <-------------------------------------------------------| GETTING WISHLIST  ---------------------------------------------------------|>

const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const wishlist = await Wishlist.findOne({ userId }).populate('items.product');

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.json(wishlist);
    } catch (error) {
        console.log("Error fetching wishlist:", error);
        res.status(500).send("Internal Server Error");
    }
};

// <-------------------------------------------------------| ADDING PRODUCT TO WISHLIST   ---------------------------------------------------------|>

const productAddToWishlist = async (req, res) => {
    try {
        const prodId = req.params.id;
        const userId = req.user._id;
        
        const wishlist = await Wishlist.findOne({ userId });
        const existingProduct = wishlist
            ? wishlist.items.find((item) => item.product == prodId)
            : null;

        if (existingProduct) {
            console.log("Product already exists in the wishlist");
            return res.status(400).json({ message: "Product already in wishlist" });
        } else {
            if (wishlist) {
                wishlist.items.push({ product: prodId });
                await wishlist.save();
            } else {
                const newWishlist = new Wishlist({
                    userId: userId,
                    items: [{ product: prodId }],
                });
                await newWishlist.save();
            }
            console.log("Product saved to wishlist 👍");
            res.status(201).json({ message: "Product added to wishlist" });
        } 
    } catch (error) {
        console.log("Try catch error in productAddToWishlist 🤷‍♀️📀🤷‍♂️", error);
        res.status(500).send("Internal Server Error");
    }
};

// <-------------------------------------------------------| REMOVING WISHLIST PRODUCT  -----------------------------------------------------|>

const removeWishlistProduct = async (req, res) => {
    try {
        const prodId = req.params.id;
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        const productIndex = wishlist.items.findIndex((item) => item.product == prodId);

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in wishlist" });
        }

        wishlist.items.splice(productIndex, 1); // Remove the product
        await wishlist.save();

        console.log("Product removed from wishlist 👍");
        res.status(200).json({ message: "Product removed from wishlist" });
    } catch (error) {
        console.log("Error removing product from wishlist:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    productAddToWishlist,
    removeWishlistProduct,
    getWishlist
};
