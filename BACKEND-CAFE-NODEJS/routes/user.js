
const express = require('express');
const connection= require('../connection');
const router = express.Router(); 

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth =require('../services/authentication');
var checkRole =require('../services/checkRole');




router.post('/signup',(req,res) =>{
let user = req.body;
query ="select email,password,role,status from user where email=?"
connection.query(query,[user.email],(err,results)=>{
if(!err){
    if(results.length <=0){
       query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','admin')";
       connection.query(query,[user.name,user.contactNumber,user.email,user.password],(err,results) =>{
        if(!err){
            return res.status(200).json({message:"Sucessfully Registered"});
        }
        else{
            return res.status(500).json(err);
        }
       })
    }
    else{
        return res.status(400).json({message : "Email Already Exist"});
    }
}
else{
 return res.status(500).json(err);
  }
  }) 
})








router.post('/login',(req,res)=>{
const user =req.body;
query="select email,password,role,status from user where email=?";
connection.query(query,[user.email],(err,results)=>{
if (!err){
  if(results.length <=0 || results[0].password !=user.password){
    return res.status(401).json({message:"Incorrect Username or Password"});
 }
else if(results[0].status === 'false'){
 return res.status(401).json({message:"wait for Admin Approval"});
}
else if (results[0].password == user.password){
const response = {email : results[0].email,role: results[0].role}
const accessToken = jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn:'8h'})
res.status(200).json({token :accessToken});
}
else{
    return res.status(400).json({message:"Something went wrong.Please try again later"});

}

}
else{
    return res.status(500).json(err);
}

   })

})

var transporter =nodemailer.createTransport({
service : 'gmail',
auth:{
user : process.env.EMAIL,
pass : process.env.PASSWORD

}
})

router.post('/forgotPassword', (req, res) => {
  const user = req.body;
  const query = "SELECT email, password FROM user WHERE email = ?";

  connection.query(query, [user.email], (err, results) => {
      if (err) {
          return res.status(500).json({ message: "Internal Server Error", error: err });
      }

      if (results.length <= 0) {
          return res.status(200).json({ message: "No account found with that email address." });
      } else {
          const mailOptions = {
              from: process.env.EMAIL,
              to: results[0].email,
              subject: "Password by Asmit's Cafe ordering System",
              html: `<p><b>Your login details for Cafe Management System</b><br><b>Email: </b>${results[0].email}<br><b>Password: </b>${results[0].password}<br><a href="https://qr-bites.netlify.app/cafe/userdashboard">Click here to login</a></p>`
          };

          transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                  console.log(error);
                  return res.status(500).json({ message: "Error sending email", error: error });
              } else {
                  console.log('Email sent: ' + info.response);
                  return res.status(200).json({ message: "Password sent successfully to your email." });
              }
          });
      }
  });
});




// GET API
router.get('/get',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
var query ="select id,name,email,contactNumber,status from user where role='admin'";
connection.query(query,(err,results)=>{
if(!err){
    return res.status(200).json(results);
}
else{
    return res.status(500).json(err);
}
   })
})

router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let user=req.body;
    var query ="update user set status=? where id=?";
    connection.query(query,[user.status,user.id],(err,results)=>{
     if(!err){
        if(results.affectedRows == 0){
            return res.status(404).json({message: "User id does not exist"});

        }
        return res.status(200).json({message: "User Updated Successfully"});
    }
    else{
        return res.status(500).json(err);
        }
      })
   })

router.get('/checkToken',auth.authenticateToken,(req,res)=>{
    return res.status(200).json({message:"true"});

})

router.post('/changePassword',auth.authenticateToken,(req,res)=>{
const user = req.body;
const email = res.locals.email;
var query ="select * from user where email=? and password=?";
connection.query(query,[email,user.oldPassword],(err,results)=>{
    if(!err){
       if(results.length <=0){
        return res.status(400).json({message:"Incorrect Old Password"});
       }
         else if(results[0].password == user.oldPassword){
            query="update user set password=? where email=?";
            connection.query(query,[user.newPassword,email],(err,results)=>{
                if(!err){
                    return res.status(200).json({message:"Password Updated Successfully."})
                }
                  else{
                    return res.status(500).json(err);
                  }
               })
            }
         else {
            return res.status(400).json({message:"Somethings Went Wrong. Please try again later"});
         }

    }
    else{
        return res.status(500).json(err);
    }
   })

})


//new

router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    const id = req.params.id;
    var query ="delete from user where id =?";
    connection.query(query,[id],(err,results)=>{
     if(!err){
        if(results.affectedRows == 0){
            return res.status(404).json({message:"User id does not found"});
        }
          return res.status(200).json({message:"Admin Deleted Successfully"});
     }
  else{
      return res.status(500).json(err);
       }
    }) 
  })
 
  
router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let user = req.body;
    let updates = [];
    let values = [];
  
    if (user.name) {
      updates.push('name = ?');
      values.push(user.name);
    }
  
    if (user.contactNumber) {
      updates.push('contactNumber = ?');
      values.push(user.contactNumber);
    }
  
    if (user.email) {
      updates.push('email = ?');
      values.push(user.email);
    }
  
    if (user.password) {
      updates.push('password = ?');
      values.push(user.password);
    }
  
    values.push(user.id);
  
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
  
    let query = `UPDATE user SET ${updates.join(', ')} WHERE id = ?`;
  
    connection.query(query, values, (err, results) => {
      if (!err) {
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'User id does not found' });
        }
        return res.status(200).json({ message: 'User Updated Successfully' });
      } else {
        return res.status(500).json(err);
      }
    });
  });
  





module.exports = router;