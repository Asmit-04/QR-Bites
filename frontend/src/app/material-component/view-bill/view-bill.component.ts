import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  displayedColumns:string[] = ['name','email','contactNumber','total','view', 'status'];
  // displayedColumns:string[] = ['name','email','contactNumber','paymentMethod','total','view', 'status'];

  dataSource:any;
  responseMessage:any;


  constructor(private billService:BillService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router) { }



  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();

  }



  tableData(tableId?: string) {
    this.ngxService.start();
    this.billService.getBills(tableId).subscribe(
      (response: any) => {
        this.ngxService.stop();
        // console.log('Bill Data:', response); 
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
  



  
  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  

  
  handleViewAction(values: any) {
    // console.log('Values:', values); // Log to verify `tableId` is present
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values,
      tableId: values.tableId // Pass tableId
    };
    dialogConfig.width = "100%";
  
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
  
    // Optionally, handle dialog close if needed
    dialogRef.afterClosed().subscribe(result => {
      // console.log('Dialog closed with result:', result);
    });
  }
  


  downloadReportAction(values:any){
    this.ngxService.start();
    var data={
      name:values.name,
      email:values.email,
      uuid:values.uuid,
      contactNumber:values.contactNumber,
      paymentMethod:values.paymentMethod,
      totalAmount:values.total,
      productDetails:values.productDetails,
    }
    this.billService.getPDF(data).subscribe(
      (response)=>{
        saveAs(response,values.uuid+'.pdf');
        this.ngxService.stop();
      }
    )
  }

  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      message : 'delete '+values.name+' bill'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
        this.ngxService.start();
        this.deleteProduct(values.id);
        dialogRef.close();
    })
  }

  deleteProduct(id:any){
    this.billService.delete(id).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
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






  onChange(status: boolean, id: any) {
    const data = {
        status: status ? 'done' : 'pending',  // Assuming you have 'done' and 'pending' statuses
        id: id
    };

    this.billService.updateOrderStatus(data).subscribe((response: any) => {
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");

        // Refresh the table data to ensure the change is reflected
        this.tableData();

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



isDone(row: any): boolean {
  return row.status === 'done';
}


}


