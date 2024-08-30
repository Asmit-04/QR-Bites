import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Category} from 'src/app/shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }
  
  add(data:any){
    return this.httpClient.post(this.url+
      "/category/add/",data,{
        headers: new HttpHeaders().set('content-Type',"application/json")

      })
  }
  
  update(data:any){
    return this.httpClient.patch(this.url+
      "/category/update/",data,{
        headers: new HttpHeaders().set('content-Type',"application/json")

      })
  }

  // getCategorys(){
  //   return this.httpClient.get(this.url+"/category/get/");
  // }

  getCategorys(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.url + "/category/get/");
  }

  //new
  delete(id:any){
    return this.httpClient.delete(this.url + "/category/delete/"+id,{
     headers: new HttpHeaders().set('Content-Type',"application/json")
   })
 }

 updateStatus(data:any){
  return this.httpClient.patch(this.url + "/category/updateStatus/",data,{
    headers: new HttpHeaders().set('Content-Type',"application/json")
  })
}

}
