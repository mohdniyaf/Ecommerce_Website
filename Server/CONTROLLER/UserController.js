const User=require('../MODEL/userSchema');
const {generateToken}=require('../utils/jwt');
const bcrypt=require('bcrypt');

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
// <                             <$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ USER SIDE $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$>                            > //
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//



const Signup=async(req,res)=>{
    try {
        const {email}=req.body;
        const userExist=await User.findOne({email});

        if(!userExist){
            const newUser=new User(req.body);
            await newUser.save();
            res.status(200).json({
                _id: newUser._id,
                name: newUser.firstname,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
                token: generateToken(newUser._id),
            });        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
}


const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        console.log("user data",user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please sign up.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }
        
        res.status(200).json({ message: 'Successfully logged in.',token:generateToken(user._id),user:{ id: user.id}});
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Internal error" });
    }
}

const getUser=async(req,res)=>{
    try {
        const userId=req.user.id; // Assuming req.user is populated by your protect middleware
        const user=await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Internal error" });
    }
}

const  UpdateUser=async(req,res)=>{
    try {
        const UpdatedData={...req.body};
        const userId=req.user.id;
        if(UpdatedData.password){
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(UpdatedData.password,salt);
            UpdatedData.password=hashedPassword;
        }
        const updateUser=await User.findByIdAndUpdate(userId,UpdatedData,{
            new: true, 
            runValidators: true,
        });
        if (!updateUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        console.log("User data updated successfully",updateUser);
        res.status(200).json(updateUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Internal error" });      
    }
}


module.exports={Signup,Login,getUser,UpdateUser};


