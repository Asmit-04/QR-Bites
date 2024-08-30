import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';
import { error } from 'console';
import {OrderService} from 'src/app/services/order.service'
import { OrderItem } from 'src/app/shared/order-item.model';
import { ActivatedRoute } from '@angular/router';
import {Category, Product,} from 'src/app/shared/models';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns:string[] = ['name','category','price','quantity','total','edit'];
  dataSource: OrderItem[] = []; 
  manageOrderForm:any =UntypedFormGroup;

  categorys: Category[] = [];
  products: Product[] = [];
  price:any;
  totalAmount:number = 0; 
  responseMessage:any;
  
  constructor(private formBuilder:UntypedFormBuilder,
    private route: ActivatedRoute, 
    private categoryService:CategoryService,
    private productService:ProductService,
    private billService:BillService,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService,
    private orderService: OrderService ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys();


    this.manageOrderForm = this.formBuilder.group({
    name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],

    email: [null, [Validators.pattern(GlobalConstants.emailRegex)]],
    contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],

    paymentMethod: ['Pay Later', Validators.required], 

    product:[null,[Validators.required]],
    category:[null,[Validators.required]],
    quantity:[null,[Validators.required]],
    price:[null,[Validators.required]],
    total:[0,[Validators.required]],

    tableId: [null, [Validators.required]] // Capture tableId
  });

  this.orderService.getOrderItems().subscribe(items => {
    this.dataSource = items;
    this.calculateTotalAmount(); // Calculate totalAmount when dataSource is updated
  });

  this.manageOrderForm.controls['quantity'].valueChanges.subscribe((newQuantity: number) => {
    const price = this.manageOrderForm.controls['price'].value || 0;
    const total = newQuantity * price;
    this.manageOrderForm.controls['total'].setValue(total);
  });

  this.manageOrderForm.valueChanges.subscribe(() => {
    this.updateTotals();
  });



  this.route.queryParams.subscribe(params => {
    const tableId = params['tableId'];
    if (tableId) {
      this.manageOrderForm.controls['tableId'].setValue(tableId);
    }
  });
  
  this.ngxService.stop(); 


  }




getCategorys(): void {
  this.categoryService.getCategorys().subscribe((response: Category[]) => {
    const filteredCategories: Category[] = [];
    
    response.forEach((category: Category) => {
      this.productService.getProductsByCategory(category.id).subscribe((products: Product[]) => {
        if (products.length > 0) {
          filteredCategories.push(category);
        }
      });
    });

    this.categorys = filteredCategories;
  }, (error: any) => {
    this.ngxService.stop();
    this.responseMessage = error.error?.message || GlobalConstants.genericError;
    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  });
}






   getProductsByCategory(value:any){
    this.productService.getProductsByCategory(value.id).subscribe((response:any)=>{
     this.products = response;
     this.manageOrderForm.controls['price'].setValue('');
     this.manageOrderForm.controls['quantity'].setValue('');
     this.manageOrderForm.controls['total'].setValue(0);
     },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
          this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    
  })

   }

   getProductDetails(value:any){
    this.productService.getById(value.id).subscribe((response:any)=>{
      this.price = response.price;
      this.manageOrderForm.controls['price'].setValue(response.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price*1);
      //new
    
      },(error:any)=>{
       this.ngxService.stop();
       if(error.error?.message){
           this.responseMessage = error.error?.message;
       }
       else{
         this.responseMessage = GlobalConstants.genericError;
       }
       this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
       })
   }


validateProductAdd(){
  if(this.manageOrderForm.controls['total'].Value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quantity'].value <=0)
return true;

else
return false;

}







validateSubmit() {
  const { name, email, contactNumber, paymentMethod } = this.manageOrderForm.controls;

  const isTotalAmountZero = this.totalAmount === 0;
  const isAnyRequiredFieldEmpty = [name, paymentMethod].some(control => !control.value);
  const isContactNumberInvalid = contactNumber.value && !contactNumber.valid;

  const isEmailInvalid = email.value && !email.valid;

  return isTotalAmountZero || isAnyRequiredFieldEmpty || isContactNumberInvalid || isEmailInvalid;
}






add(): void {
  const formData = this.manageOrderForm.value;



  const existingItem = this.dataSource.find((e: OrderItem) => e.id === formData.product.id);

  if (!existingItem) {
    const itemTotal = formData.price * formData.quantity;
    const newItem: OrderItem = {
      id: formData.product.id,
      name: formData.product.name,
      category: formData.category, 
      
      quantity: formData.quantity,
      price: formData.price,
      total: itemTotal
    };



    this.dataSource.push(newItem);
    this.dataSource = [...this.dataSource];
    
    this.snackbarService.openSnackBar(GlobalConstants.productAdded, "success");
  } else {
    this.snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
  }
 
  this.calculateTotalAmount(); 
  this.updateTotals(); 

  this.manageOrderForm.patchValue({
    category: '',
    product: '',
    price: '',
    quantity: '',
    total: ''
  });
}









calculateTotalAmount() {
  this.totalAmount = this.dataSource.reduce((sum: number, item: OrderItem) => sum + item.total, 0);
}





  
  handleDeleteAction(value:any,element:any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value,1);
    this.dataSource=[...this.dataSource];
    this.orderService.removeFromOrder(element.id); // Update OrderService
    }

    submitAction(){
      this.ngxService.start();
      var formData = this.manageOrderForm.value;
      // const tableId = 5; // Replace with the actual logic to get the table ID dynamically if needed

      var data ={
        name:formData.name,
        email:formData.email,
        contactNumber:formData.contactNumber,
        paymentMethod:formData.paymentMethod,
        totalAmount:this.totalAmount,
        productDetails : JSON.stringify(this.dataSource),
        tableId: formData.tableId // Use the dynamically set table ID
      };
      // console.log('Submitting data:', data);
      
      this.billService.generateReport(data).subscribe((response:any)=>{
        this.downloadFile(response?.uuid);
        this.manageOrderForm.reset({paymentMethod: 'Pay Later',});
        this.dataSource = [];
        this.totalAmount = 0;
        this.orderService.clearOrder(); // Clear OrderService
      },(error:any)=>{  
        this.ngxService.stop();
        if(error.error?.message){
            this.responseMessage = error.error?.message;
        }
        else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
        })

    }


downloadFile(fileName:any){
  var data = {
    uuid:fileName
  }
  this.billService.getPDF(data).subscribe((response:any)=>{
    saveAs(response,fileName+'.pdf');
    this.ngxService.stop();
  })
}



updateItemTotal(item: OrderItem) {
  item.total = item.quantity * item.price;
  this.calculateTotalAmount();
}


decreaseQuantity(item?: any): void {
  if (item) {
    const currentQuantity = item.quantity || 1;
    if (currentQuantity > 1) {
      item.quantity = currentQuantity - 1;
      this.setQuantity(item);
    }
  } else {
    const currentQuantity = Number(this.manageOrderForm.controls['quantity'].value) || 1;
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      this.manageOrderForm.controls['quantity'].setValue(newQuantity);
      this.setQuantity(); // Call setQuantity to update total
    }
  }
}



increaseQuantity(item?: any): void {
  if (item) {
    // Ensure item.quantity is treated as a number
    item.quantity = (Number(item.quantity) || 0) + 1;
    this.setQuantity(item);
  } else {
    // For form control, ensure the value is treated as a number
    const currentQuantity = Number(this.manageOrderForm.controls['quantity'].value) || 0;
    const newQuantity = currentQuantity + 1;
    this.manageOrderForm.controls['quantity'].setValue(newQuantity);
    this.setQuantity(); // Call setQuantity to update total
  }
}


setQuantity(item?: any): void {
  // For item, ensure quantity and price are numbers
  const quantity = item ? Number(item.quantity) : Number(this.manageOrderForm.controls['quantity'].value);
  const price = item ? Number(item.price) : Number(this.manageOrderForm.controls['price'].value) || 0;
  
  if (item) {
    item.total = quantity * price;
  } else {
    this.manageOrderForm.controls['total'].setValue(quantity * price);
  }
  this.updateTotals();
}




updateTotals(): void {
  this.totalAmount = this.dataSource.reduce((sum, item) => sum + (item.total || 0), 0);
}


}
 
