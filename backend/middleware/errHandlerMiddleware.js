const errHandler = async (err,req,res,next)=> {
 const statusCode = res.statusCode ? res.statusCode : 500
   if(statusCode){
     res.status(statusCode)
     res.json({message:err.message})
   }

   next()
}

module.exports = errHandler