const { default: slugify } = require('slugify')
const categoryModel = require('../models/categoryModel')

//create category controller
const createCategoryController = async (req,res)=>{
 try {
    const {name}=req.body
    if(!name){
        res.send(401).send({
            message:'name is required'
        })
    }
    //check category
    const existingCategory = await categoryModel.findOne({name})
    //existing category
    if(existingCategory){
        return res.status(200).send({
            success:true,
            message:"Category already Exist"
        })
    }
     //save
    const category = await new categoryModel({name,slug:slugify(name)}).save()
    res.status(200).send({
        success:true,
        message:'new category created',
        category
    })
 } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Error in Category",
        error
    })
 }
}

///update category controller
const updateCategoryController = async(req,res)=>{
    try {
       const {name} = req.body
       const {id}= req.params
       const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true}) 
       res.status(200).send({
        success:true,
        message:"category updated successfully",
        category
       })
    } catch (error) {
       console.log(error)
       res.status(500).send({
        success:false,
        message:"Error while updating category",
        error,
       }) 
    }
}
//get all category
const categoryController = async (req,res)=>{
 try {
    const  category = await categoryModel.find({})
    res.status(200).send({
        success:true,
        message:" All category List",
        category
    })
 } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Error while getting all category",
        error,
    })
    
 }
}

//get Single category controllers
const singleCategoryController = async (req,res) =>{
    try {
       
       const category = await categoryModel.findOne({slug:req.params.slug}) 
       res.status(200).send({
        success:true,
        message:"Get Single Category",
        category
       })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting single category",
            error
        })
    }
}
//delete Category
const deleteCategoryController =async (req,res)=>{
    try {
        const {id}=req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Delete category successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while Deleting Category",
            error
        })
    }
}

module.exports={
    createCategoryController, 
    updateCategoryController,
    categoryController, 
    singleCategoryController, 
    deleteCategoryController
    }