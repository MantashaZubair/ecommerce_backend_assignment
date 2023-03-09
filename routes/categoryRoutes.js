const express = require("express")
const { createCategoryController ,updateCategoryController,categoryController ,singleCategoryController, deleteCategoryController}= require("../controllers/categoryController") 
const { isAdmin, requireSignin } = require("../middleware/authMiddleware")

const router = express.Router()

//routes
//create Category
router.post('/create-category', requireSignin, isAdmin, createCategoryController)

//update category
router.put('/update-category/:id' ,requireSignin,isAdmin,updateCategoryController)

//getAll category
router.get("/get-category", categoryController)

//single category
router.get('/single-category/:slug', singleCategoryController)

//delete category
router.delete('/delete-category/:id' , requireSignin, isAdmin, deleteCategoryController)

module.exports=router