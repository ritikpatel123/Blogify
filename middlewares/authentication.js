const { validateToken } = require("../services/authentication");

function checkForAuthentictionCookie(cookieName) {
    return (req,res,next)=>{
        const tokencookie=req.cookies[cookieName];

        try{
            const userpayload=validateToken(tokencookie);
            req.user=userpayload;
        } catch(e){}

        next();
    };

}

module.exports={
    checkForAuthentictionCookie
}