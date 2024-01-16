const { Router } = require("express");
const Blog =require('../models/blog')
const multer=require('multer')
const path=require('path');
const Comment = require("../models/comment");
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
    // console.log(req.body)
    const {title,body}=req.body;
    // console.log(req.file)

  const blog= await  Blog.create({
        title,
        body,
        coverImageURL:`/uploads/${req.file.filename}`,
        createdBy:req.user._id,
    })
    return res.redirect(`/blog/${blog._id}`);

})

router.get('/:id', async(req,res)=>{
  const id=req.params.id;
  const blog= await Blog.findById(id).populate('createdBy');
  const comment=await Comment.find({blogId:id}).populate('createdBy');
  // console.log(blog)

  res.render("blog",{
    user:req.user,
    blog:blog,
    comments:comment,
  })
})
router.post('/comment/:blogId', async (req,res)=>{
  await  Comment.create({
    comment:req.body.content, 
    blogId:req.params.blogId,
    createdBy:req.user._id,
   })

  return res.redirect(`/blog/rs${req.params.blogId}`)

});


module.exports = router;
