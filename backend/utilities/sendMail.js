const nodemailer = require('nodemailer')


const sendMailerFunc =  async (options)=> {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICES,
          auth: {
            user: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD
          }

        
    })

     const mailOptions = {
        from: process.env.SENDER_MAIL,
        to: process.to,
        subject: options.subject,
        html: options.html
     }

     transporter.sendMail(mailOptions, function(err,info){
        if(err){
        console.log('errors in sending')
        }
        if(info){
        console.log('success in sending')
        }
     })
    
}

module.exports = { sendMailerFunc }