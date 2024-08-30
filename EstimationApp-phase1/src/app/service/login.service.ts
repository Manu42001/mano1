import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private welcomeBack: boolean|undefined; // New flag
  NewUserData: any = {};
  ResetUserData: any = {};
  private user: any = {};
  forgotUrl= (' https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/login');

  constructor(private http: HttpClient) {
    // this.user=JSON.parse(localStorage.getItem('user')) || {};
    const userName= localStorage.getItem('user');
    this.user=userName ? JSON.parse(userName): {};
  }

  getname(): string {
    return this.user.name || '';
  }

  setname(name: string): void {
    this.user.name = name;
    localStorage.setItem('user',JSON.stringify(this.user));
  }

  signin(form: any): Observable<any> {
    var email = encodeURIComponent(form.value.email);
    var password = encodeURIComponent(form.value.password);
    return this.http.get(
      `https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/login?email=${email}&password=${password}`);
  }

  signUp(Register:any):Observable<any> {
    return this.http.post("https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/login",Register);
  }

  public forgotPut(data:any):Observable<any>{
    var email = data.email;
    var body={
     password: data.password
    }
    return this.http.put(`${this.forgotUrl}/${email}`,body);
  }

  resetPassword(email: any): Observable<any> {
    return this.http.get(`https://rjn9hw68jj.execute-api.ap-south-1.amazonaws.com/dev/reset?email=${email}`);
  }

  setWelcomeBack(value: boolean) {
    this.welcomeBack = value;
  }

  getWelcomeBack() {

    return this.welcomeBack;

  }
}
