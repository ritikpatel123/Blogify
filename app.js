const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
require('dotenv').config()
const app=express()
const PORT= process.env.PORT 
const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog')
const Blog=require('./models/blog')
const { checkForAuthentictionCookie } = require('./middlewares/authentication')
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthentictionCookie("token"));
app.use(express.static(path.resolve('./public')));

mongoose.connect(process.env.MONGO_URL).then((e)=>{
    // console.log("mongodb connected ")
})

app.set("view engine", 'ejs')
app.set("views",path.resolve('./views'))




app.get('/', async (req,res)=>{

  const allBlog=await Blog.find({});
  res.render("home",{
    user:req.user,
    blogs:allBlog,
  })
})


app.use('/user',userRoute);
app.use('/blog',blogRoute);


app.listen(PORT,(err)=>{
    console.log(`server is live at port -${PORT}`)
})