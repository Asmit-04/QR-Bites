const express= require('express');
const connection = require('../connection');
const router =express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs= require('fs');
var uuid= require('uuid');
var auth =require('../services/authentication');
const { json } = require('body-parser');
var checkRole=require('../services/checkRole');


router.post('/generateReport', (req, res) => {
  const generatedUuid = uuid.v1();
  const orderDetails = req.body;

  try {
    var productDetailsReport = JSON.parse(orderDetails.productDetails);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid product details format' });
  }

  // Include tableId in the query
  var query = "insert into bill(name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy,tableId,status) values(?,?,?,?,?,?,?,?,?,'true')";
  connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email, orderDetails.tableId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    
    ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
      productDetails: productDetailsReport,
      name: orderDetails.name,
      email: orderDetails.email,
      contactNumber: orderDetails.contactNumber,
      paymentMethod: orderDetails.paymentMethod,
      totalAmount: orderDetails.totalAmount,
      tableId: orderDetails.tableId // Pass tableId to the template
    }, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      
      pdf.create(results).toFile('./generated_pdf/' + generatedUuid + ".pdf", function (err, data) {
        if (err) {
          return res.status(500).json({ message: 'Internal Server Error' });
        } else {
          return res.status(200).json({ uuid: generatedUuid });
        }
      });
    });
  });
});


router.post('/getPdf',function(req,res){
    const orderDetails =req.body;
    const pdfPath ='./generated_pdf/'+orderDetails.uuid+'.pdf';
    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }
    else{
        var productDetailsReport = (orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname,'',"report.ejs"),{productDetails:productDetailsReport,name:orderDetails.name, email:orderDetails.email, contactNumber:orderDetails.contactNumber, paymentMethod:orderDetails.paymentMethod, totalAmount:orderDetails.totalAmount},(err,results)=>{
            if(err){
                return res.status(500).json(err);
            }
            else{
                pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid +".pdf",function(err,data){
                    if(err){
                        return res.status(200).json(err);
                    }
                    else{
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                        
                    }
                })
            }
        })
    }
})

router.get('/getBills',auth.authenticateToken,(req,res,next)=>{
  
var query = "select * from bill order by id DESC";
connection.query(query,(err,results)=>{
 if(!err){
    return res.status(200).json(results);
 }
 else{return res.status(500).json(err); }


})

})







router.delete('/delete/:id',auth.authenticateToken,(req,res,next)=>{
    const id = req.params.id;
    var query = "delete from bill where id=?";
connection.query(query,[id],(err,results)=>{
    if(!err){
        if(results.affectedRows == 0){
            return res.status(404).json({message:"Bill id does not found"});
        }
        return res.status(200).json({message:"Bill Deleted Sucessfully"});
        }
        else {
            return res.status(500).json(err);
        }
    
})
})




router.patch('/updateOrderStatus', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
  const bill = req.body;
  const query = "UPDATE bill SET status = ? WHERE id = ?";

  connection.query(query, [bill.status, bill.id], (err, results) => {
    if (!err) {
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Bill ID not found" });
      }
      const statusMessage = bill.status === 'done' ? "Bill status updated to 'done' successfully" : "Bill status updated to 'pending' successfully";
      return res.status(200).json({ message: statusMessage });
    } else {
      return res.status(500).json(err);
    }
  });
});








module.exports = router;



