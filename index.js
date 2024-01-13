const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const multer  = require('multer')
const app=express()
const PORT=8000
const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog')
const Blog=require('./models/blog')
const { checkForAuthentictionCookie } = require('./middlewares/authentication')
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthentictionCookie("token"));
app.use(express.static(path.resolve('./public')));

mongoose.connect("mongodb+srv://ritikp153:idRIwoe2KWPQUudc@cluster0.zzjorxo.mongodb.net/Blogify").then((e)=>{
    console.log("mongodb connected ")
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