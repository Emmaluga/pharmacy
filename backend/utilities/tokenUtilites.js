const jwt = require('jsonwebtoken')

const allTokenFunc = async (user,res)=> {
 const storeToken = await genToken(user._id)
    res.cookie('token', storeToken, 
        {maxAge:60*60*1000, secure:true, httponly:true}
    )
    
}
const genToken = async (id)=> {
    return await jwt.sign({id}, process.env.JWT_TOKEN,{expiresIn:60*60*1000}
    )
}

module.exports = { allTokenFunc }