const express = require("express");
const {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  filterProductController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  braintreeTokenController,
  braintreePaymentController,
} = require("../controllers/productController");
const { isAdmin, requireSignin } = require("../middleware/authMiddleware");
const formidable = require("express-formidable");

const router = express.Router();

//routes

//create product
router.post(
  "/create-product",
  requireSignin,
  isAdmin,
  formidable(),
  createProductController
);

//get product

router.get("/get-product", getProductController);

//single product

router.get("/get-product/:slug", getSingleProductController);

//get photo based on product id
router.get("/product-photo/:pid", productPhotoController);

//update product
router.put(
  "/update-product/:pid",
  requireSignin,
  isAdmin,
  formidable(),
  updateProductController
);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filter", filterProductController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get('/search/:keyword',searchProductController)

//similer product
router.get('/related-product/:pid/:cid', relatedProductController)

//category wise product
router.get('/product-category/:slug', productCategoryController)

//payment route
//token
router.get('/braintree/token' , braintreeTokenController)

//payments
router.post('/braintree/payment', requireSignin,braintreePaymentController)

module.exports = router;
