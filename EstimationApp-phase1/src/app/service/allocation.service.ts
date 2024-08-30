import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AllocationService {
  private apiUrl = 'https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/allocation'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  dataPostApi(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, data, { headers }).pipe(
      catchError(error => {
        console.error('Error occurred while posting data:', error);
        return throwError(error);
      })
    );
  }

  fetchSkillsAndPhases(rfp_no: number): Observable<any> {
    const params = new HttpParams().set('RfpNum', rfp_no.toString());
    return this.http.get(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error occurred while fetching data:', error);
        return throwError(error);
      })
    );
  }

  deletePhaseAndSkills(formData: { phases: string, rfp_no: number }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = {
      headers: headers,
      body: formData
    };
    return this.http.request('delete', this.apiUrl, options).pipe(
      catchError(error => {
        console.error('Error occurred while deleting data:', error);
        return throwError(error);
      })
    );
  }
  
  
  
}
