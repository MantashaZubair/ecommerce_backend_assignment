const express = require("express")
const colors = require("colors")
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors   = require('cors')
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes.js")
const categoryRoutes = require("./routes/categoryRoutes.js")
const productRoutes = require("./routes/productRoutes")
 const path = require("path")

//configure env
dotenv.config()

//database config
connectDB()

//test object
const app = express()

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'./ecommerce_frontend/build')))

//routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product', productRoutes)


//rest api

app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,'./ecommerce_frontend/build/index.html'));
})

//PORT
const PORT =process.env.PORT||8080;

app.listen(PORT,()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white)
})