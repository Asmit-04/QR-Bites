import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';
//new
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ProductService } from 'src/app/services/product.service';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {
 
  @Output() categoryStatusChanged = new EventEmitter<void>(); 


  displayedColumns:string[] = ['name','edit'];
  dataSource:any;
  responseMessage:any;
  
  constructor(private categoryService:CategoryService,
    private productService:ProductService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router) {}



  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

tableData(){
  this.categoryService.getCategorys().subscribe((response:any)=>{
    this.ngxService.stop();
    this.dataSource = new MatTableDataSource(response);
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

applyFilter(event:Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

handleAddAction(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = {
    action: 'Add'
  }
  dialogConfig.width = "850px";
  const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
  this.router.events.subscribe(()=>{
    dialogRef.close();
  });
  const sub = dialogRef.componentInstance.onAddCategory.subscribe(
    (response)=>{
      this.tableData();
    }
  )
}

handleEditAction(values:any){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = {
    action: 'Edit',
    data:values
  }
  dialogConfig.width = "850px";
  const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
  this.router.events.subscribe(()=>{
    dialogRef.close();
  });
  const sub = dialogRef.componentInstance.onEditCategory.subscribe(
    (response)=>{
      this.tableData();
    }
  )
}

//new

handleDeleteAction(values:any){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data={
    message : 'delete '+values.name+' category permanently? Deleting category '+values.name+' will result in also deleting all its products'
  };
  const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
  const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteCategory(values.id);
      dialogRef.close();
  })
}

deleteCategory(id:any){
  this.categoryService.delete(id).subscribe((response:any)=>{    
    this.ngxService.stop();
    this.tableData();
    this.responseMessage = response?.message;
    this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{ 
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
          this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
}

onChange(status: any, id: any) {
  var data = {
    status: status.toString(),
    id: id
  };

  this.categoryService.updateStatus(data).subscribe((response: any) => {
    this.responseMessage = response?.message;
    this.snackbarService.openSnackBar(this.responseMessage, "success");

    // Disable or enable products based on the status
    if (status) {
      this.productService.enableProductsByCategory(id).subscribe(() => {
        this.categoryStatusChanged.emit(); // Emit event after enabling products
      });
    } else {
      this.productService.disableProductsByCategory(id).subscribe(() => {
        this.categoryStatusChanged.emit(); // Emit event after disabling products
      });
    }

  }, (error: any) => {
    this.ngxService.stop();
    console.log(error);
    if (error.error?.message) {
      this.responseMessage = error.error?.message;
    } else {
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  });
}


// onChange(status: any, id: any) {
//   var data = {
//       status: status.toString(),
//       id: id
//   }

//   // Update the category status
//   this.categoryService.updateStatus(data).subscribe((response: any) => {
//       this.responseMessage = response?.message;
//       this.snackbarService.openSnackBar(this.responseMessage, "success"); 

//       // Disable or enable products based on the status
//       if (status) {
//           console.log("Enabling products for category ID:", id); // Debug log
//           this.enableProductsInCategory(id);
//       } else {
//           console.log("Disabling products for category ID:", id); // Debug log
//           this.disableProductsInCategory(id);
//       }

//   }, (error: any) => {
//       this.ngxService.stop();
//       console.log("Error updating category status:", error); // Debug log
//       if (error.error?.message) {
//           this.responseMessage = error.error?.message;
//       } else {
//           this.responseMessage = GlobalConstants.genericError;
//       }
//       this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
//   });
// }



disableProductsInCategory(categoryId: any) {
  this.productService.disableProductsByCategory(categoryId).subscribe(
    (response: any) => {
      this.snackbarService.openSnackBar('All products in this category have been disabled.', "success");
    },
    (error: any) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    }
  );
}

enableProductsInCategory(categoryId: any) {
  this.productService.enableProductsByCategory(categoryId).subscribe(
    (response: any) => {
      this.snackbarService.openSnackBar('All products in this category have been enabled.', "success");
    },
    (error: any) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    }
  );
}






}