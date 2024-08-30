import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { error } from 'console';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
   displayedColumns:string[] = ['name','description','price','edit'];
    dataSource:any;
    responseMessage:any
    categories: string[] = []; 
    categoryStatusSubscription?: Subscription; 


    constructor(private productService:ProductService,
      private ngxService:NgxUiLoaderService,
      private dialog:MatDialog,
      private snackbarService:SnackbarService,
      private router:Router) {}
  

  ngOnInit(): void {     
    this.ngxService.start();
    this.tableData();
    this.categoryStatusSubscription = this.productService.categoryStatusChanged.subscribe(() => {
      this.tableData(); 
    });
  }

  ngOnDestroy(): void {
   
    if (this.categoryStatusSubscription) {
      this.categoryStatusSubscription.unsubscribe();
    }
  }
  

  private getUniqueCategories(products: any[]): string[] {
    const categoriesSet = new Set<string>();
    products.forEach(product => {
      categoriesSet.add(product.categoryName);
    });
    return Array.from(categoriesSet);
  }
  getProductsByCategory(category: string): any[] {
    return this.dataSource?.data.filter((product: any) => product.categoryName === category);
  }
  


  tableData(): void {
    this.productService.getProducts().subscribe(
      (response: any) => {
        this.ngxService.stop();
       
  
        if (response && Array.isArray(response)) {
          response.sort((a: any, b: any) => {
            if (a.categoryName !== b.categoryName) {
              return a.categoryName.localeCompare(b.categoryName);
            }
            return a.name.localeCompare(b.name);
          });
  
          if (response.length > 0) {
            this.dataSource = new MatTableDataSource(response);
            this.categories = this.getUniqueCategories(response);
          } else {
            this.dataSource = new MatTableDataSource([]);
            this.categories = [];
          }
        } else {
          this.dataSource = new MatTableDataSource([]);
          this.categories = [];
        }
      },
      (error: any) => {
        this.ngxService.stop();
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




  // tableData(): void {
  //   this.productService.getProducts().subscribe(
  //     (response: any) => {
  //       this.ngxService.stop();
  //       console.log('Response:', response); // Log response for debugging
  
  //       // Ensure the response contains products
  //       if (response && Array.isArray(response)) {
  //         // Sort products by category and name
  //         response.sort((a: any, b: any) => {
  //           if (a.categoryName !== b.categoryName) {
  //             return a.categoryName.localeCompare(b.categoryName);
  //           }
  //           return a.name.localeCompare(b.name);
  //         });
  
  //         // Log sorted products for debugging
  //         console.log('Sorted Products:', response);
  
  //         // Check if there are products
  //         if (response.length > 0) {
  //           this.dataSource = new MatTableDataSource(response);
  
  //           // Extract unique categories from products
  //           this.categories = this.getUniqueCategories(response);
  //         } else {
  //           this.dataSource = new MatTableDataSource([]); // No products
  //           this.categories = [];
  //         }
  //       } else {
  //         this.dataSource = new MatTableDataSource([]); // Empty response or invalid format
  //         this.categories = [];
  //       }
  //     },
  //     (error: any) => {
  //       this.ngxService.stop();
  //       console.log(error);
  //       if (error.error?.message) {
  //         this.responseMessage = error.error?.message;
  //       } else {
  //         this.responseMessage = GlobalConstants.genericError;
  //       }
  //       this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  //     }
  //   );
  // }
  

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
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
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
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (response)=>{
        this.tableData();
      }
    )
  }

    handleDeleteAction(values:any){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data={
        message : 'delete '+values.name+' product'
      };
      const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
      const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
          this.ngxService.start();
          this.deleteProduct(values.id);
          dialogRef.close();
      })
    }

    deleteProduct(id:any){
      this.productService.delete(id).subscribe((response:any)=>{
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


  

    onChange(status:any,id:any){
      var data = {
        status:status.toString(),
        id:id
      }
      this.productService.updateStatus(data).subscribe((response:any)=>{
        this.responseMessage=response?.message;
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




        
      }


      // newwwwwwww

      // getProductsByCategory(category: string): any[] {
      //   return this.dataSource?.data.filter((product: any) => product.categoryName === category);
      // }
    // Function to get unique categories from products
