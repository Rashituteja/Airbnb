module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        return res.redirect("/login");
    }
    next();
}


module.exports.isOwner = (req, res, next)=>{
    
}