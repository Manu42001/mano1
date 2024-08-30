import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
providedIn: 'root'
})

export class ApiService {

  [x: string]: any;
private rfp: any = {};
private formData:any=null;
private consoleResponse:string[]=[];


combinedURL='https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/combined';

private apiUrl = 'https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/metrics';

rfpUrl=' https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/rfp';

forgotUrl= (' https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/login');

dataUrl='https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/data';

public metricsget = 'https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/ref';

private summaryUrl = 'https://dnjwbxapp6.execute-api.us-east-1.amazonaws.com/dev/summary';

constructor(private http: HttpClient) {

  const rfpFormat= localStorage.getItem('rfp');

  this.rfp=rfpFormat ? JSON.parse(rfpFormat): {};


  if(!this.formData){

    const savedData=localStorage.getItem('formData');

  this.formData=savedData?JSON.parse(savedData):{};

  }

}
getRfp(): number {
  return this.rfp.rfpNo || ''
 
}
setRfp( num :number, airline:string) {
  this.rfp.rfpNo = num;
  this.rfp.product = airline;
  localStorage.setItem('rfp',JSON.stringify(this.rfp));
  console.log("rfp num setted=",num)
 
}

rfpPut(data:number,data1:number):Observable<any>{
  const params={
    sum:data,
    rfp_no:data1
  }
  return this.http.put(`https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/combined`,null,{params});
}

public rfpPost(data:any) :Observable<any>{
  return this.http.post(`${this.rfpUrl}`,data);
}



getRfpProduct(): string{
  return this.rfp.product || '';
}

copyOfRecord(rfp_no:number, product:string):Observable<any>{
  const data={
    "rfp_no": rfp_no,
    "product": product
  }
  console.log("copyRecord",data)
  return this.http.post('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/copy',data)
}










getFormData():any{

  return this.formData;

}

 

saveFormData(formData:any):void{

  this.formData=formData;

  localStorage.setItem('formData',JSON.stringify(formData));

}
getMetData(): Observable<any> {
  return this.http.get(this.metricsget);
}

callMetApi(data: any): Observable <any>{
return this.http.post(this.apiUrl, data);
}





getAirline(): string{
  return this.rfp.product || '';
}




clearRfp(): void {
  localStorage.removeItem('formData');
  localStorage.removeItem(this.rfp.format);
  localStorage.clear()
}





 



signIn(login:any):Observable<any> {

    return this.http.get(`https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/login?emailid=${login.emailid}&password=${login.password}`);

  }



signUp(Register:any):Observable<any> {

    return this.http.post("https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/login",Register);

  }

public forgotPut(email:any,data:any):Observable<any>{

    return this.http.put(`${this.forgotUrl}/${email}`,data);

  }



  
private apiUrl1 = '';

data1:any[]=[];


  getData(): Observable<any> {

    return this.http.get(`${this.apiUrl1}/data`);

  }



  updateData(id: number, newData: any): Observable<any> {

    return this.http.put(`${this.apiUrl1}/data/${id}`, newData);

  }

  private apiUrlf = 'https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/sdlc';



  getLifecycleValues(): Observable<string[]> {

    return this.http.get<string[]>(`${this.apiUrlf}`);

  }



public combinedPost(data:any):Observable<any>{
  return this.http.post('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/combined',data)
}


  allSubmit(rfp:number,data:any):Observable<any>{
    const params=
        {
          RfpNum:rfp,
          listdata:data
          }
          console.log("inside all submit",params)
    return this.http.post('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/combined',params);
  }



  putCombine(data:any):Observable<any>{
    return this.http.put('',data);
  }

 
  
            dataApi(data: any): Observable <any>{
              return this.http.post(this.dataUrl, data);
              }

             
             
              // }
              dataSubCompUpdateApi(id: number, rfp:number, sub: string):Observable<any>{
                const data={
                    id: id,
                    RfpNum: rfp,
                    subComponents: sub
                };
                console.log(data);
              
                return this.http.put('https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/data6',data);
              }
    
              summaryApi(): Observable<any> {

                return this.http.get(this.summaryUrl);
              }  
}