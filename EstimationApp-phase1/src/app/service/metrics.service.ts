import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private apiUrl = 'https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/metrics';

  constructor(private http: HttpClient) { }

  fetchDictionaryData(rfp:number): Observable<any>{
    return this.http.get(`https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/ref?RfpNum=${rfp}`);
  }

  deleteMetrics(phase:string,rfp:number):Observable<any>{
    const body = {
      phase: phase,
      RfpNum: rfp
    };
    console.log("phase",phase);
    console.log(body);
    return this.http.delete('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/metrics',{body:JSON.stringify(body)});
  }

  callApi(data: any): Observable <any>{
    return this.http.post(this.apiUrl, data);
  }

  PostdictionaryData(data:any, rfp:number):Observable<any>{
    const p={

      "listdata":data,
      "RfpNum":rfp

    }
    console.log(p)
    return this.http.post('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/ref',p);

  }

}
