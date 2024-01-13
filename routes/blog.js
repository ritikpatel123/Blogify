const { Router } = require("express");
const Blog =require('../models/blog')
const multer=require('multer')
const Blog=require('../models/blog')
const path=require('path')
const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
       const filename=`${Date.now()}-${file.originalname}`
      cb(null, filename)
    }
  })
  

const upload = multer({ storage: storage })

router.get('/add-blog',(req,res)=>{
    return res.render("addblog",{
        user:req.user
        })

})


router.post('/',upload.single('coverImage'),async (req,res)=>{
    console.log(req.body)
    const {title,body}=req.body;
    console.log(req.file)

  const blog= await  Blog.create({
        title,
        body,
        coverImageURL:`/uploads/${req.file.filename}`,
        createdBy:req.user._id,
    })
    return res.redirect(`/blog/${blog._id}`);

})

router.get('/blog:id', async (req,res)=>{
  const id=req.params.id;
  const blog= await Blog.findById(id);
  res.render("blog",{
    user:req.user,
    blog:blog
  })
})



module.exports = router;
