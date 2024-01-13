const {Schema,model}=require('mongoose');
const {createHmac ,randomBytes}=require('crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,

    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default:'/images/profile.png'
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    }

},{timestamps:true})



userSchema.pre("save",function (next){
    const user=this;

    if(!user.isModified("password")) return;
    const salt=randomBytes(16).toString();
    const hashedpassword=createHmac('sha256',salt).update(user.password).digest("hex");
    this.salt=salt;
    this.password=hashedpassword;

    next();
    
})

userSchema.static("matchPasswordAndGenerateToken", async function (email,password){

    const user=await this.findOne({email})
    if(!user) throw new Error("user not found");

    const salt=user.salt;
    const hashedpassword=createHmac('sha256',salt).update(password).digest("hex");

     if (user.password!==hashedpassword) throw new Error("incorrect password");

     const token=createTokenForUser(user);
     return token;

}) 

const User= model("users",userSchema)

module.exports=User;