const express= require('express');
const connection = require('../connection');
const router =express.Router();
var auth =require('../services/authentication');
var checkRole=require('../services/checkRole');

router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
let category = req.body;
query = "insert into category (name) values(?)";
connection.query(query,[category.name],(err,results)=>{
if(!err){
    return res.status(200).json({message:"Category Added Successfully"});
}
else {
    return res.status(500).json(err);
     }
   })
})

router.get('/get',(req,res,next)=>{
  var query ="select *from category order by name";
  connection.query(query,(err,results)=>{
   if(!err){
    return res.status(200).json(results);
   }
else{
    return res.status(500).json(err);
     }
  })
})



router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
let product = req.body;
var query ="update category set name=? where id=?";
connection.query(query,[product.name,product.id],(err,results)=>{
 if(!err){
    if(results.affectedRows == 0){
        return res.status(404).json({message:"Category id does not found"});
    }
    return res.status(200).json({message:"Category Updated Successfully"});
 }
else{
    return res.status(500).json(err);
      }
   })
})


//new

router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
  const id = req.params.id;
  var query ="delete from category where id =?";
  connection.query(query,[id],(err,results)=>{
   if(!err){
      if(results.affectedRows == 0){
          return res.status(404).json({message:"Category id does not found"});
      }
        return res.status(200).json({message:"Category Deleted Successfully"});
   }
else{
    return res.status(500).json(err);
     }
  }) 
})

router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
  let category = req.body;
  var query ="update category set status=? where id=?";
  connection.query(query,[category.status,category.id],(err,results)=>{
   if(!err){
      if(results.affectedRows == 0){
          return res.status(404).json({message:"category id does not found"});
      }
      return res.status(200).json({message:"category status Updated Successfully"});
   }
  else{
      return res.status(500).json(err);
        }
     })
  })



module.exports = router;