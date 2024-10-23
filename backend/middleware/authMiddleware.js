const bcryptjs = require('bcryptjs')
const authSchema = require('../model/authModel')
const jwt = require('jsonwebtoken')


const authMiddleware = async (req,res,next) =>{
  let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
       token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        res.status(500)
        throw new Error('no token, pls provide token')


    }

    try {
      const decoded = await jwt.verify(token,process.env.JWT_TOKEN) 
      req.createdUsers = await authSchema.findById(decoded.id).select('-password') 
      
      next()

    } catch (error) {
        res.status(500)
        throw new Error('no authorization, wrong token')
    }
    
    
}
  

const adminAuth = async (req,res,next)=> {
  if( req.createdUsers.role === 'user'){
    res.status(500)
    throw new Error('you must be an admin to access this route')
      
  }

  next()

}

module.exports = {
    authMiddleware,
    adminAuth
}


