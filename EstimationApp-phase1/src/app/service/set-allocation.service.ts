import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SetAllocationService {

  private apiUrl = 'https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/SetAllocation'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  saveAllocationData(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, data, { headers: headers });
  }
}
