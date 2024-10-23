const asyncHandler = require('express-async-handler')
const authSchema = require('../model/authModel')


//search functionality

  
   

const allUsersCtrl = asyncHandler ( async (req,res)=> {

//   const keyword = req.query.keyword ? {
//     firstName: {
//       $regex: req.query.keyword,
//       $options: "i"
//     },
 
//  } : {}

  const quary = req.query.quary || ""
  const page = req.query.pageNumber || 0
  const pageCount = 5
  const filters = {
    lastName: req.query.lastName
  }
  const searchc = {}
  if(quary){
    searchc.$text = {$search:quary}

  }
  const totalCount = await authSchema.find(searchc).countDocuments()
  const allUsers = await authSchema
  .find(searchc)
  .skip(page * pageCount)
  .limit(pageCount)

    if(!allUsers){
       res.status(500)
       throw new Error('no users')
    }

    res.status(201).json({
      allUsers,
      page,
      pageCount,
    count: Math.ceil( totalCount / pageCount),
    totalCount
     
      

    })
})

const singleUsersCtrl = asyncHandler ( async (req,res)=> {
  
   const singleUser = await authSchema.findById(req.params.id)
    if(!singleUser){
      res.status(500)
      throw new Error('no single user')
    }
    res.status(201).json(singleUser)

})

const updateUsersCtrl = asyncHandler ( async (req,res)=> {
   const updateUsers = await authSchema.findByIdAndUpdate(req.params.id,
    req.body, {new: true})
   if(!updateUsers){
    res.status(500)
    throw new Error('cant update user! ')
  }

  res.status(201)
  res.json(updateUsers)
})



const deleteUsersCtrl = asyncHandler ( async (req,res)=> {
  
  const deleteSingleUser = await authSchema.findByIdAndDelete(req.params.id)
   if(!deleteSingleUser){
     res.status(500)
     throw new Error('cant delete user! ')
   }
   res.status(201).json(deleteSingleUser)

})


module.exports = {
  allUsersCtrl,
  singleUsersCtrl,
  updateUsersCtrl,
  deleteUsersCtrl
}