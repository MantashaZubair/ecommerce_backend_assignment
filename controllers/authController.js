const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel")
const orderModel = require("../models/orderModel")
const contactModel = require("../models/contactModel")
const JWT = require("jsonwebtoken")

//POST REGISTER

const registerController = async(req,res) => {
    try {
        const {name,email,password,phone,address,answer}=req.body
        //validations
        if(!name || !email || !password || !phone || !address || !answer){
            return res.status(400).json({message:"one or more mandatory fields are empty"})
        }
        //check user
        const existingUser = await userModel.findOne({email:email})
         //existing user
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'Already Register Please Login'
            })
        }
        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({name, email, phone,address,answer,password:hashedPassword}).save()

        res.status(201).send({
            success:true,
            message:"User Regfullyister Success",
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Resistration",
            error
        })
    }
};

//POST LOGIN

const loginController = async(req,res)=>{
    try {
       const {email,password}=req.body
       //validation
       if(!email || !password){
        return res.status(404).send({
            success:false,
            message:"invalid email or password",
        })
       }
       //check user
       const user = await userModel.findOne({email}) 
       if(!user){
        return res.status(404).send({
            success:false,
            message:"Email not registerd"
        })
       }
       const match = await comparePassword(password,user.password)
       if(!match){
        return res.status(200).send({
            success:false,
            message:"invalid password"
        })
       }
       //token
       const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
       res.status(200).send({
        success:true,
        message:"Logged in successfully",
        user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role,
        },
        token,
       })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Login",
            error
        })
        

    }
}

//forgotPasswordController
const forgotPasswordController= async (req,res)=>{
 try {
    const {email,newPassword,answer,}=req.body
    if(!email){
        res.status(400).send({
            success:false,
            message:"email is required"
        }) 
    }
    if(!answer){
        res.status(400).send({
            success:false,
            message:"answer is required"
        }) 
    }
    if(!newPassword){
        res.status(400).send({
            success:false,
            message:"New password is required"
        }) 
    }
    //check 
    const user = await userModel.findOne({email,answer})
    //validation
    if(!user){
        return res.status(404).send({
            success:false,
            message:"wrong email or answer"
        })
    }
    const hashed = await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id,{password:hashed})
     res.status(200).send({
        success:true,
        message:"Password reset successfully"
    })
 } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Something went wrong",
        error,
    })
 }
}



//getAllUserController

const getAllUserController = async(req,res)=>{
    try {
        const user = await userModel.find({})
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error,
        })
    }
}
//contact us
const contactController = async(req,res)=>{
try {
    const {name,email,message}=req.body
    //validations
    if(!name || !email || !message){
        return res.status(400).json({message:"one or more mandatory fields are empty"})
    } 
    const user = await contactModel({name,email,message}).save()
    res.status(200).send({
        success:true,
        message:"Thanku!!!",
        user,
    })

} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Something went wrong",
        error,
    })
}
}


//update User Profile
const updateProfileController=async(req,res)=>{
    try {
        const {name,email,password,phone,address} = req.body
        const user = await userModel.findById(req.user._id);
        //password
        if(password && password.length < 6){
            return res.json({error:"password is required and 6 character long"})
        }
        //hashedpassword
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name:name ||user.name,
            password:hashedPassword ||user.password,
            phone:phone||user.phone,
            address:address || user.address
        },{name:true})
        res.status(200).send({
            success:true,
            message:"profile updated Successfully",
            updatedUser,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while update user profile",
            error,
        })
    }
}

//user orders
const getOrdersController = async(req,res)=>{
    try {
       const orders = await orderModel.find({buyer:req.user._id})
       .populate("products","-photo")
       .populate("buyer" , "name")
       res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while user order",
            error,
        })
    }
}

//all-orders admin

const getAllOrdersController = async(req,res)=>{
    try{
        const orders = await orderModel.find({})
        .populate("products","-photo")
        .populate("buyer" , "name")
        .sort({createdAt: "-1"})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while occuring all orders",
            error,
        })
    }
}

//orderStatus Controller
const orderStatusController = async(req,res)=>{
try {
    const { orderId} = req.params;
    const {status} = req.body;
    const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true});
    res.json((orders))
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Error while occuring  order Status",
        error,
    })
}
}

module.exports={
    registerController,
     loginController,
     getAllUserController,
     forgotPasswordController,
     updateProfileController,
     getOrdersController,
     getAllOrdersController,
     orderStatusController,
     contactController
    }