import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable,EventEmitter  } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product,} from 'src/app/shared/models';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = environment.apiUrl;
  categoryStatusChanged: EventEmitter<void> = new EventEmitter<void>();

  emitCategoryStatusChange() {
    this.categoryStatusChanged.emit();
  }

  constructor(private httpClient: HttpClient) { }

  add(data:any){
    return this.httpClient.post(this.url + "/product/add/",data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  updateStatus(data:any){
    return this.httpClient.patch(this.url + "/product/updateStatus/",data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }
  
  update(data:any){
    return this.httpClient.patch(this.url + "/product/update/",data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  getProducts(){
    return this.httpClient.get(this.url+"/product/get/");
  } 
  
  // updateStatus(data:any){
  //   return this.httpClient.patch(this.url + "/product/updateStatus/",data,{
  //     headers: new HttpHeaders().set('Content-Type',"application/json")
  //   })
  // }

  delete(id:any){
       return this.httpClient.delete(this.url + "/product/delete/"+id,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      })
    }
  

    // getProductsByCategory(id:any){
    //   return this.httpClient.get(this.url + "/product/getByCategory/"+id);
    // }
  
    getProductsByCategory(categoryId: number): Observable<Product[]> {
      return this.httpClient.get<Product[]>(`${this.url}/product/getByCategory/${categoryId}`);
    }



    getById(id:any){
      return this.httpClient.get(this.url + "/product/getById/"+id);
    }

    disableProductsByCategory(categoryId: any) {
      return this.httpClient.put(`${this.url}/product/disableByCategory/${categoryId}`, {});
    }
    enableProductsByCategory(categoryId: any) {
      return this.httpClient.put(`${this.url}/product/enableByCategory/${categoryId}`, {});
  }
      

 
  }



