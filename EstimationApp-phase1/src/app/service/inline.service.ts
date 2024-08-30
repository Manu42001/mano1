import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class inlineService {
    combinedURL='https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/combined';

    constructor(private http: HttpClient) { }

    allSubmit(rfp:number,data:any):Observable<any>{
    const params=
        {
            RfpNum:rfp,
            listdata:data
            }
            console.log("inside all submit",params)
    return this.http.post('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/combined',params);
    }

    fetchCombine(data:any):Observable<any>{
    console.log(data)
        return this.http.get(`https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/combined?RfpNum=${data}`);
        }
          
    deleteCombine(rfp:number,data:any):Observable<any>{
        const params={
            RfpNum:rfp,
            id:data
            }
            console.log("inside all submit",params)
        return this.http.delete('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/combined',{body:JSON.stringify(params)});
    }

    fetchConfidence(con:any):Observable<any>{
        return this.http.get(`https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/confidence?confidence_scale=${con.scale}&dev_hrs=${con.dev}`);
    }

    fetchrfpdash():Observable<any>{
        return this.http.get(`https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/retrieve`);
    }

    saveEdit1(data:any):Observable<any>{
        return this.http.post('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/combine1',data);
    }
 
}
