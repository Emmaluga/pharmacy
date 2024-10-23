const asyncHandler = require('express-async-handler')
const authSchema = require('../model/authModel')
const { allTokenFunc } = require('../utilities/tokenUtilites')
const { sendMailerFunc } = require('../utilities/sendMail')
const crypto = require('crypto')


const registerContrl = asyncHandler ( async (req,res)=> {
 
     const {firstName,lastName,email,password,role} = req.body
     const existUser = await authSchema.findOne({email})
      

      if(existUser) {
        res.status(500)
        throw new Error('info exist, register')
      }

      const newUsers = await authSchema.create({
         firstName, lastName, email, password,role
      })

      if(!newUsers){
        res.status(500)
      throw new Error('invalidate credentials')
      }

      res.status(200)
      res.json({message: 'registered successfully'})
})


const loginContrl = asyncHandler ( async (req, res)=> {
    const {email, password } = req.body
     
     const checkUser = await authSchema.findOne({email})

      if(checkUser && (await checkUser.comparePassword(password))){
        const token =  await allTokenFunc(checkUser, res)
           res.status(200)
           res.json({message: `logged in successfully ${checkUser.firstName}`, token })
      }
      res.status(500)
      throw new Error('password or email does not match')
      
     
      
})


const userProfileContrl = async (req,res)=> {
  const {firstName} = await authSchema.findById(req.createdUsers.id)
  res.status(200)
  .json({
    message: `welcome to your dashboard ${firstName}`
  })

}

const fgtpasswordCtrl = asyncHandler ( async (req,res)=> {

  const {email} = req.body
  const user = await authSchema.findOne({email})
  if(!user){
   res.status(500)
   throw new Error('information exixt pls register')
  }

  const storeToken = await user.GenTokenFunc()
  await user.save()

  const url = `http://localhost:3000/resetpassword/${storeToken}`

  const message = 
 `  <2>You requested a password reset</2>
  <p>Please click the link below to reset your password</p>
 <a href=${url} clicktracking=off>${url}</a>
   <p>Please ignore this message if you did not request a reset password</p>
   `

   const sendingMessage =  await sendMailerFunc({
       to: await user.email,
       subject: 'password reset',
       html: message
   })

   res.status(200)
   res.json({message: 'email sent'})

     if(!sendingMessage){
      user.resetPasswordToken = undefined
      user.resetPasswordTokenExpires = undefined

      await user.save()

        res.status(400)
        throw new Error('email not sent.')
     }

})


const resetpassCtrl = asyncHandler ( async (req,res)=> {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')
   const user = await authSchema.findOne({
    resetPasswordToken,
    resetPasswordTokenExipres:  { $gt: Date.now() }

   })

   if(!user){
    res.status()
    throw new Error('invalid reset token')

   }
   user.password = req.body.password,
   user.resetPasswordToken = undefined,
   user.resetPasswordTokenExipres = undefined

   await user.save()

   res.status(201)
   res.json({message: 'password reset'})


    
})





const logoutContrl = async (req,res)=> {
  res.clearCookie("token")
  res.status(200)
  .json({
    message: 'successfully logged out'
  })
}

module.exports = {
    registerContrl,
    loginContrl,
    userProfileContrl,
    fgtpasswordCtrl,
    resetpassCtrl,
    logoutContrl
}