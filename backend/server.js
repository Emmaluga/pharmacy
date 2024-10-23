require('dotenv').config()
const express = require('express')
const connectDB = require('./config/connectDB')
const notFound = require('./middleware/notFoundMiddleware')
const cors = require('cors')
const cookiePerser = require('cookie-parser')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/usersRoute')
const errHandler = require('./middleware/errHandlerMiddleware')
const app = express()



//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookiePerser())

//route
app.use("/api", authRoute)
app.use("/api", userRoute)
//custom middleware
app.use(notFound)
app.use(errHandler)



const port = process.env.port || 2000

const start = async ()=> {
    try {
        await connectDB(process.env.MONGODBURL)
        console.log('connected to DB')
        app.listen(port, ()=> console.log(`server running on port ${port}`))
        
    } catch (error) {
    console.log('failed to connect DB')
    }
}

start()

