const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')


const authSchema = mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
        text: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        text: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    role: {
     type: String,
     enum: ['user', 'admin'],
     default : 'user'
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    resetPasswordToken: String,
    resetPasswordTokenExpires: Date

},
{
  timeStamps: true
}
)

authSchema.index({

    firstName:"text",
    lastName: "text"
})
 


authSchema.pre('save', async function(next){
    
    if(!this.isModified('password')){
        next()

    }else{

       this.password = await bcryptjs.hash(this.password, 10)
    }
})

authSchema.methods.comparePassword = async function(enterApassword){
    return await bcryptjs.compare(enterApassword, this.password)
}


authSchema.methods.GenTokenFunc = async function(){
    
    const token = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    this.resetPasswordTokenExpires =  Date.now() + 10  * (10 * 1000)
     
    return token
}




module.exports = mongoose.model('Auth', authSchema)