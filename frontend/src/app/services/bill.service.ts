import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }


generateReport(data: any) {
  const tableId = localStorage.getItem('tableId'); // Retrieve table ID from local storage
  if (tableId) {
    data.tableId = tableId; // Add table ID to data
  }
  return this.httpClient.post(this.url + "/bill/generateReport/", data, {
    headers: new HttpHeaders().set('content-Type', 'application/json')
  });
}


getPDF(data:any):Observable<Blob>{
  return this.httpClient.post(this.url+
    "/bill/getpdf",data,{responseType:'blob'});
    
 }

//  getBills(){
//   return this.httpClient.get(this.url+
//     "/bill/getBills/");
//  }

 getBills(tableId?: string) {
  let apiUrl = this.url + "/bill/getBills/";
  
  if (tableId) {
    apiUrl += tableId; // Append the tableId to the URL if provided
  }

  return this.httpClient.get(apiUrl);
}








 delete(id:any){
  return this.httpClient.delete(this.url+
  "/bill/delete/"+id,{
    headers: new HttpHeaders().set('content-Type',"application/json")
  })
}



updateOrderStatus(data:any) {
  
  return this.httpClient.patch(this.url + "/bill/updateOrderStatus", data, {
    headers: new HttpHeaders().set('Content-Type', "application/json")
  });
}




}