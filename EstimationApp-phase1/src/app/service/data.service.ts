import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class DataService {
  private dataKey = 'sdlcData';
  displayTablesFunction: () => void;

  constructor(private http: HttpClient) {}

  setDisplayTablesFunction(func: () => void): void {
    this.displayTablesFunction = func;
  }
 
  getDisplayTablesFunction(): () => void {
    return this.displayTablesFunction;
  }

  dataPostApi(data:any):Observable <any>{
    console.log("dataapi",data)
    return this.http.post('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/data1', data);
  }

  fetchData(data:any): Observable<any>{
    return this.http.get(`https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/data?RfpNum=${data}`);
  }

  deleteCompTable(comp:string, rfp:number):Observable<any>{
    const delTable = {
      Components: comp,
      RfpNum: rfp
    };
    console.log(delTable);
    return this.http.delete('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/data6',{body:delTable});
  }

  dataCompUpdateApi(rfp:number, oldComp:string, newcomp:string, oldSub:any[], newSub:any[]):Observable<any>{
      const data={
        "RfpNum": rfp,
        "Components": oldComp,
        "newComponent":newcomp,
        "subComponents":oldSub,
        "newsubComponents":newSub
      }
      console.log(data);
    
      return this.http.put('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/data6',data);
  }

  deletesubcomponent(id:number, rfp:number):Observable<any>{
    const delBody = {
      id: id,
      RfpNum: rfp
    };
    console.log(delBody);
    return this.http.delete('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/data4',{body:delBody});
  }

  fetchDictionaryData(): Observable<any>{
    return this.http.get('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/ref');
  }

  fetchDictionaryDataByRfp(rfp:number): Observable<any>{
    return this.http.get(`https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/ref?RfpNum=${rfp}`);
  }


}
