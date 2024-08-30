import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private summaryUrl = 'https://dnjwbxapp6.execute-api.us-east-1.amazonaws.com/dev/summary';
  constructor(private http: HttpClient) { }

  fetchData(): Observable<any> {
    return this.http.get<any>(this.summaryUrl); 
  }
}
