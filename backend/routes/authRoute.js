const express = require('express')
const { registerContrl , loginContrl, userProfileContrl, 
   fgtpasswordCtrl, resetpassCtrl, logoutContrl } = require('../controllers/authController')
const { authMiddleware } = require('../middleware/authMiddleware')
const { loginValidation, registerValidation, validation} = require('../middleware/validateMiddleware')
const authRoute = express.Router()


authRoute.post('/register', registerValidation, validation, registerContrl)
authRoute.post('/login', loginValidation, validation, loginContrl)
authRoute.get('/userProfile', authMiddleware, userProfileContrl)
authRoute.post('/forgotpassword', fgtpasswordCtrl )
authRoute.put('/resetpassword/:resettoken', resetpassCtrl)
authRoute.delete('/logout', logoutContrl)

module.exports = authRoute