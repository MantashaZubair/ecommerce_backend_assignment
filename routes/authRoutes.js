const express = require("express")
const {registerController,
     loginController,
      getAllUserController,
      forgotPasswordController,
      contactController,
      updateProfileController,
      getOrdersController,
      getAllOrdersController,
      orderStatusController,
    } =require("../controllers/authController")
const { requireSignin, isAdmin } = require("../middleware/authMiddleware")
//router Object
const router = express.Router()

//routing
//REGISTER || METHOD POST
router.post("/register", registerController)

//LOGIN || METHOD POST
router.post("/login", loginController)

//FORGOT PASSWORD
router.post('/forgot-password', forgotPasswordController)

//contact us 
router.post('/contactus',contactController)

//getall users route
router.get('/get-all-users',requireSignin, isAdmin, getAllUserController)

//protected user route auth
router.get('/user-auth', requireSignin , (req,res)=>{
    res.status(200).send({ok:true})
})
//protected  admin route auth
router.get('/admin-auth', requireSignin ,isAdmin, (req,res)=>{
    res.status(200).send({ok:true})
})

//updateControler
router.put('/profile',requireSignin,updateProfileController)

//user orders
router.get('/orders',requireSignin,getOrdersController)

//admin orders
router.get('/all-orders',requireSignin, isAdmin ,getAllOrdersController)

//order Status update
router.put('/order-status/:orderId', requireSignin, isAdmin , orderStatusController)

module.exports= router;