import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PivotService {

  constructor(private http:HttpClient) { }


  fetchPivot(data:any):Observable<any>{
    return this.http.get(` https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/est_summary?RfpNum=${data}`);
  }

}