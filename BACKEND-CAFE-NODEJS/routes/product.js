const express= require('express');
const connection = require('../connection');
const router =express.Router();
var auth =require('../services/authentication');
var checkRole=require('../services/checkRole');



router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let product = req.body;
    var query = "insert into product (name,categoryId,description,price,status) values(?,?,?,?,'false')";
    connection.query(query,[product.name,product.categoryId,product.description,product.price],(err,results)=>{
    if(!err){
        return res.status(200).json({message:"Product Added Successfully"});
    }
    else {
        return res.status(500).json(err);
         }
       })
    })


    router.get('/get',(req,res,next)=>{
        var query ="select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
        connection.query(query,(err,results)=>{
         if(!err){
          return res.status(200).json(results);
         }
      else{
          return res.status(500).json(err);
           }
        })
      })

      router.get('/getByCategory/:id',(req,res,next)=>{
        const id = req.params.id;
        var query ="select id,name from product where categoryId = ? and status ='true' ";
        connection.query(query,[id],(err,results)=>{
         if(!err){
          return res.status(200).json(results);
         }
      else{
          return res.status(500).json(err);
           }
        }) 
    })

    router.get('/getById/:id',(req,res,next)=>{
        const id = req.params.id;
        var query ="select id,name,description,price from product where id = ? ";
        connection.query(query,[id],(err,results)=>{
         if(!err){
          return res.status(200).json(results[0]);
         }
      else{
          return res.status(500).json(err);
           }
        }) 
    })

    router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
        let product = req.body;
        var query ="update product set name=?,categoryId=?,description=?,price=? where id=?";
        connection.query(query,[product.name,product.categoryId,product.description,product.price ,product.id],(err,results)=>{
         if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Product id does not found"});
            }
            return res.status(200).json({message:"Product Updated Successfully"});
         }
        else{
            return res.status(500).json(err);
              }
           })
        })

        router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
            const id = req.params.id;
            var query ="delete from product where id =?";
            connection.query(query,[id],(err,results)=>{
             if(!err){
                if(results.affectedRows == 0){
                    return res.status(404).json({message:"Product id does not found"});
                }
                  return res.status(200).json({message:"Product Deleted Successfully"});
             }
          else{
              return res.status(500).json(err);
               }
            }) 
        })

        router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
            let user = req.body;
            var query ="update product set status=? where id=?";
            connection.query(query,[user.status,user.id],(err,results)=>{
             if(!err){
                if(results.affectedRows == 0){
                    return res.status(404).json({message:"Product id does not found"});
                }
                return res.status(200).json({message:"Product status Updated Successfully"});
             }
            else{
                return res.status(500).json(err);
                  }
               })
            })

            router.put('/disableByCategory/:categoryId', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
                const categoryId = req.params.categoryId;
            
                // Use 'false' for deactivation
                const query = "UPDATE product SET status = 'false' WHERE categoryId = ?";
                
                connection.query(query, [categoryId], (err, results) => {
                    if (!err) {
                        if (results.affectedRows === 0) {
                            return res.status(404).json({ message: "No products found for this category" });
                        }
                        return res.status(200).json({ message: "All products in the category have been disabled successfully" });
                    } else {
                        return res.status(500).json(err);
                    }
                });
            });

            router.put('/enableByCategory/:categoryId', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
                const categoryId = req.params.categoryId;
            
                // Ensure you use the correct column name
                const query = "UPDATE product SET status = 'true' WHERE categoryId = ?"; 
                
                connection.query(query, [categoryId], (err, results) => {
                    if (!err) {
                        if (results.affectedRows === 0) {
                            return res.status(404).json({ message: "No products found for this category" });
                        }
                        console.log(`Enabled ${results.affectedRows} products for category ${categoryId}`); // Log the result
                        return res.status(200).json({ message: "All products in the category have been enabled successfully" });
                    } else {
                        console.log(`Error enabling products for category ${categoryId}:`, err); // Log any errors
                        return res.status(500).json(err);
                    }
                });
            });
            



      module.exports= router;