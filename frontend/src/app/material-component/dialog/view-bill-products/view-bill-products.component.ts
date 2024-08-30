import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-bill-products',
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss']
})
export class ViewBillProductsComponent implements OnInit {
  displayedColumns: string[] = ['name','category','price','quantity','total'];
  dataSource:any;
  data:any;
  tableId: string | null = '';


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  public dialogRef: MatDialogRef<ViewBillProductsComponent>) { }

  ngOnInit() {
    this.data = this.dialogData.data;
    this.dataSource = (this.dialogData.data.productDetails);
  //  this.dataSource = JSON.parse(this.dialogData.data.productDetails);
  // this.tableId = localStorage.getItem('tableId');
  this.tableId = this.dialogData.tableId; // Access the `tableId` from dialogData
  // console.log('Received data:', this.data);
  // console.log('Product Details:', this.dataSource);
  // console.log('Table ID:', this.tableId);
  }
}


