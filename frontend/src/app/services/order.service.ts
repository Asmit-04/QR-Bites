// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {
//   private orderKey = 'orderItems';
//   private url =  environment.apiUrl;// Replace with your actual API URL

//   constructor(private httpClient: HttpClient) { }

//   addToOrder(product: any): Observable<any> {
//     // Add product to local storage
//     let order = this.getOrder();
//     order.push(product);
//     localStorage.setItem(this.orderKey, JSON.stringify(order));

//     // Simulate an API call
//     const headers = new HttpHeaders().set('Content-Type', 'application/json');
//     return this.httpClient.post<any>(`${this.url}/order/add`, product, { headers })
//       .pipe(
//         catchError(error => {
//           console.error('Error adding to order:', error);
//           return of({ success: false, message: 'Failed to add product to order' });
//         })
//       );
//   }

//   getOrder(): any[] {
//     let order = localStorage.getItem(this.orderKey);
//     return order ? JSON.parse(order) : [];
//   }

//   clearOrder(): void {
//     localStorage.removeItem(this.orderKey);
//   }
// }



import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderItem } from 'src/app/shared/order-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderItems: OrderItem[] = [];
  private orderItemsSubject = new BehaviorSubject<OrderItem[]>(this.orderItems);

  getOrderItems() {
    return this.orderItemsSubject.asObservable();
  }

  addToOrder(item: OrderItem) {
    // Calculate total if not provided
    if (!item.total) {
      item.total = item.price * item.quantity;
    }

    this.orderItems.push(item);
    this.orderItemsSubject.next(this.orderItems);
  }


  removeFromOrder(itemId: number) {
    // Remove the item with the given id from orderItems
    this.orderItems = this.orderItems.filter(item => item.id !== itemId);
    // Update the BehaviorSubject with the new array
    this.orderItemsSubject.next(this.orderItems);
  }

  clearOrder() {
    // Clear the orderItems array
    this.orderItems = [];
    // Update the BehaviorSubject with the empty array
    this.orderItemsSubject.next(this.orderItems);
  }



}



