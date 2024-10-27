const Product=require('../MODEL/productSchema');
const category=require('../MODEL/categorySchema');
const {cloudinary} =require('../utils/cloudinary'); 
const { Readable } =require ('stream');

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
// <                             <$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ USER SIDE $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$>                            > //
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//

// Function to get categories
const getCategory = async function (req, res) {
  try {
    const response = await category.find({ active: true });
    if (response.length > 0) {
      res.status(200).json(response);  
    } else {
      res.status(404).json({ message: "Couldn't find categories" });  
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });  
  }
};


// <-------------------------------------------------------| RENDERING PRODUCTS ACCORDING TO THE CATEGORIES -----------------------------------|>

const productLoad = async (req, res) => {
  try {
    const categoryName = req.params.categoryName; // Get the category name from the URL
    const Category = await category.findOne({ categoryName }); // Find the category by name

    if (!Category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ category: Category._id }); // Fetch products by category ID

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    res.status(200).json(products); // Send back the products
  } catch (error) {
    console.log("Error loading products by category:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// <-------------------------------------------------------| RENDERING ALL PRODUCTS -----------------------------------------------------------|>


  const allProduct = async (req, res) => {
    try {    
      const response = await Product.find({});
  
      res.status(200).json(response);
    } catch (error) {
      console.log("Try catch error in allProducts 🤷‍♀️📀🤷‍♂️");
      console.log(error.message);
      res.status(500).json({ success: false, error: "Server Error" });
    }
}

// <-------------------------------------------------------| RENDERING DETAILED VIEW OF A  PRODUCTS -------------------------------------------|>
const productSingleView = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    
    // Fetch product by ID
    const product = await Product.findById(id);
    console.log(product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Send the product details back to the client
    res.status(200).json(product);
    
  } catch (error) {
    console.log("Try catch error in productSingleView 🤷‍♀️📀🤷‍♂️");
    console.log(error.message);

    // Handle errors gracefully
    res.status(500).json({ message: "Server error" });
  }
};



// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
// <                             <$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ADMIN SIDE $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$>                            > //
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//


// <-------------------------------------------------------| ADDING CATEGORY | -------------------------------------------|>


const addCategory = async (req, res) => {
  try {
      const { categoryName } = req.body;

      // Check if category already exists
      const existingCategory = await category.findOne({ categoryName });
      if (existingCategory) {
          return res.status(400).json({ message: 'Category already exists' });
      }
      // Create a new category
      const newCategory = new category({ categoryName });
      await newCategory.save();
      res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

// <-------------------------------------------------------| UPDATE CATEGORY | -------------------------------------------|>


const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;

    // Find the category by ID and update its name
    const updatedCategory = await category.findByIdAndUpdate(
      id,
      { categoryName },
      { new: true } // Return the updated category
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// <-------------------------------------------------------| DELETE CATEGORY | -------------------------------------------|>



const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category by ID and delete it
    const deletedCategory = await category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// <-------------------------------------------------------| ADDING PRODUCT |-------------------------------------------|>


const addProduct = async (req, res) => {
  try {
    const { categoryName, name, price, offerPrice, description, isFeatured, stock, subCategory, size } = req.body;

    const Category = await category.findOne({ categoryName });

    if (!Category) {
      return res.status(400).json({ message: 'Category not found' });
    }

    // Handle image upload
    let imageObjects = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null); // Signal the end of the stream

          const uploadStream = cloudinary.uploader.upload_stream(
            { public_id: file.originalname }, // Set filename in Cloudinary
            (error, result) => {
              if (error) {
                return reject(new Error('Upload failed'));
              }
              // Add the uploaded image URL and details to the imageObjects array
              resolve({
                url: result.secure_url, // Cloudinary URL
                altText: `${name} image`,
                caption: `${name} product image`,
              });
            }
          );

          // Pipe the buffer stream to the uploadStream
          bufferStream.pipe(uploadStream);
        });
      });

      // Wait for all uploads to finish
      imageObjects = await Promise.all(uploadPromises);
    }

    const newProduct = new Product({
      name,
      category: Category._id,
      subCategory,
      price,
      offerPrice,
      description,
      size,
      images: imageObjects,  // Store images
      isFeatured,
      stock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// <-------------------------------------------------------| UPDATE PRODUCT |-------------------------------------------|>


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters
    const { name, price, offerPrice, description, isFeatured, stock, subCategory, size } = req.body;

    // Handle image upload if any files are provided
    let imageObjects = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null); // End stream

          const uploadStream = cloudinary.uploader.upload_stream(
            { public_id: file.originalname },
            (error, result) => {
              if (error) {
                return reject(new Error('Image upload failed'));
              }
              resolve({
                url: result.secure_url,
                altText: `${name} image`,
                caption: `${name} product image`,
              });
            }
          );

          bufferStream.pipe(uploadStream);
        });
      });

      // Wait for all image uploads to finish
      imageObjects = await Promise.all(uploadPromises);
    }

    // Find the product by ID and update its details
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        offerPrice,
        description,
        subCategory,
        size,
        images: imageObjects.length > 0 ? imageObjects : undefined, // Only update images if provided
        isFeatured,
        stock,
      },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// <-------------------------------------------------------| DELETE PRODUCT |-------------------------------------------|>

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports={allProduct,productSingleView,productLoad,addCategory,addProduct,getCategory,updateCategory,deleteCategory,updateProduct,deleteProduct};
