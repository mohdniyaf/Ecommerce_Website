const Address= require('../MODEL/addressSchema');

// <-------------------------------------------------------| RENDERING A PAGE WITH ADDRESSES LISTED -------------------------------------------|>

const getAddress = async (req, res) => {
    try {
        const userId = req.user._id; 
        const addressData = await Address.findOne({ userId });

        if (!addressData || !addressData.address.length) {
            return res.status(404).json({ msg: "No addresses found" });
        }

        res.status(200).json(addressData.address); // Return only the address array
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Internal error" });
    }
};

// <-------------------------------------------------------| POSTING & ADDING ADDRESS TO THE DATABASE -----------------------------------------|>

const addAddress = async (req, res) => {
    try {
        const userId = req.user.id; 
        const newAddress = req.body;
        
        // Find the user's address document or create a new one if not exists
        let addressData = await Address.findOne({ userId });
        
        if (!addressData) {
            // If no address data exists, create a new document for this user
            addressData = new Address({ userId, address: [newAddress] });
        } else {
            // Push the new address to the address array
            addressData.address.push(newAddress);
        }

        const savedAddress = await addressData.save();
        res.status(201).json(savedAddress.address); // Return the updated address array
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Internal error" });
    }
};

// <-------------------------------------------------------| RENDERING THE PAGE TO EDIT ADDRESSES----------------------------------------------|>

const updateAddress = async (req, res) => {
    try {
        const { id } = req.params; // Address id
        const updatedAddressData = req.body; // Updated address data from the request body

        // Find the user's address document
        const addressData = await Address.findOne({ userId: req.user.id });
        if (!addressData) return res.status(404).json({ msg: "Address data not found" });

        // Find the specific address by id and update it
        const addressIndex = addressData.address.findIndex(addr => addr._id.toString() === id);
        if (addressIndex === -1) return res.status(404).json({ msg: "Address not found" });

        // Update the address details at the found index
        addressData.address[addressIndex] = { ...addressData.address[addressIndex], ...updatedAddressData };

        const updatedData = await addressData.save();
        res.status(200).json(updatedData.address); // Return updated address array
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Internal error" });
    }
};

// <-------------------------------------------------------| DELETING THE ADDRESSES FROM THE ARRAY---------------------------------------------|>

const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params; // Address id

        // Find the user's address document
        const addressData = await Address.findOne({ userId: req.user.id });
        if (!addressData) return res.status(404).json({ msg: "Address data not found" });

        // Filter out the address to delete by id
        addressData.address = addressData.address.filter(addr => addr._id.toString() !== id);
        if (addressData.address.length === 0) return res.status(404).json({ msg: "Address not found" });

        await addressData.save();
        res.status(200).json({ msg: "Address deleted successfully", address: addressData.address }); // Return remaining addresses
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Internal error" });
    }
};

module.exports = { addAddress, getAddress, updateAddress, deleteAddress };
