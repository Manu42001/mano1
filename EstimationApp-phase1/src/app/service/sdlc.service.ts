import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SdlcService {
  SdlcUrl = `https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/sdlc`; // Replace with your API Gateway URL
  
  constructor(private http: HttpClient) {}

  fetchSdlcItems(rfp: number): Observable<any> {
    return this.http.get( `https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/sdlc?RfpNum=${rfp}`);
  }
  
  // Update an SDLC item through your API
  updateSdlcItem(editedItem: any, rfp: number ): Observable<any> {
    const data={
      "listdata":editedItem,
      "RfpNum": rfp
    }
    return this.http.put(this.SdlcUrl, data);
  }

  // Save a new SDLC item through your API
  saveSdlcItem(sdlcItem: any, rfp: number): Observable<any> {
    console.log("inside sdlc service")
    const data={
      "p":sdlcItem,
      "RfpNum": rfp
    }
    console.log(data)
    return this.http.post(`${this.SdlcUrl}`, data);
  }

  fetchsdlc(data:any): Observable<any>{
    return this.http.get(`https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/sdlc?RfpNum=${data}`);
  }
    
}