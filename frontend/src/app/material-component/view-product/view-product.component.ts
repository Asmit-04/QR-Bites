
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GetProductService } from 'src/app/services/get-product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import {OrderService} from 'src/app/services/order.service'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { OrderItem } from 'src/app/shared/order-item.model';





@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']  
})
export class ViewProductComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'price','edit'];
  dataSource!: MatTableDataSource<any>;
  responseMessage: any;
  categories: string[] = [];
  noActiveProducts: boolean = false;
  // private orderItems: OrderItem[] = [];
 orderItems: OrderItem[] = [];
 

  constructor(
    private GetProductService: GetProductService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private orderService: OrderService ,// Inject OrderService
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();

      // Subscribe to the order service to keep track of order items
      this.orderService.getOrderItems().subscribe(items => {
        this.orderItems = items;
      });
  }



  tableData(): void {
    this.GetProductService.getProducts().subscribe(
      (response: any) => {
        this.ngxService.stop();
        // console.log('Response:', response); // Log response for debugging
  
        if (response && Array.isArray(response)) {
          // Sort products by category and name
          response.sort((a: any, b: any) => {
            if (a.categoryName !== b.categoryName) {
              return a.categoryName.localeCompare(b.categoryName);
            }
            return a.name.localeCompare(b.name);
          });
  
          // Filter to only include active products
          const activeProducts = response.filter(
            (product: any) => product.status === 'true' // Compare as a string
          );
  
          // console.log('Active Products:', activeProducts);
  
          if (activeProducts.length > 0) {
            this.dataSource = new MatTableDataSource<any>(activeProducts);
            this.categories = this.getUniqueCategories(activeProducts);
            this.noActiveProducts = false;
          } else {
            this.dataSource = new MatTableDataSource<any>([]);
            this.categories = [];
            this.noActiveProducts = true;
          }
        } else {
          this.dataSource = new MatTableDataSource<any>([]);
          this.categories = [];
          this.noActiveProducts = true;
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
  

  getProductsByCategory(category: string): any[] {
    return this.dataSource?.data.filter((product: any) => product.categoryName === category);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Function to get unique categories from products
  private getUniqueCategories(products: any[]): string[] {
    const categoriesSet = new Set<string>();
    products.forEach(product => {
      categoriesSet.add(product.categoryName);
    });
    return Array.from(categoriesSet);
  }




  addToOrder(product: any) {
    console.log('Product:', product);

    // Transform category into an object with id and name
    const orderItem: OrderItem = {
      id: product.id,
      name: product.name,
      category: { id: product.categoryId, name: product.categoryName }, // Construct category object
      price: product.price,
      quantity: 1, // Default quantity or from the user's selection
      total: 0 // This will be calculated in the service
    };

    // Add to order
    this.orderService.addToOrder(orderItem);

    // Custom snack bar configuration
    const snackBarConfig: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'center',  // 'start', 'center', or 'end'
      verticalPosition: 'top',        // 'top' or 'bottom'
      panelClass: ['custom-snackbar']
     
      
    }

    // Show success message
    this.snackBar.open('Item added to order successfully!', 'Close', snackBarConfig);
  }


}
  





















