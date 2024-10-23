const express = require('express')
const { allUsersCtrl , singleUsersCtrl,updateUsersCtrl,deleteUsersCtrl} = require('../controllers/userController')
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware')
const userRoute = express()


userRoute.get('/allUsers', authMiddleware, adminAuth, allUsersCtrl )
userRoute.get('/singleUsers/:id', authMiddleware, adminAuth, singleUsersCtrl )
userRoute.put('/updateUsers/:id', authMiddleware, adminAuth, updateUsersCtrl )
userRoute.delete('/deleteUsers/:id', authMiddleware, adminAuth, deleteUsersCtrl )

module.exports = userRoute

