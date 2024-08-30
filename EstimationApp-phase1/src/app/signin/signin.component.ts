import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  showPassword = false;
  email: string='';
  password: string='';
  rememberme: Boolean=false;
  msg: string="";
  loginForm: FormGroup;
  fullName: any;

  constructor(private fb: FormBuilder,private service:LoginService,private route:Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    console.log("hi")
    console.log(this.rememberme)
      if (this.loginForm.valid) {
        if(this.rememberme){
          console.log("i am in");
          localStorage.setItem('currentUser', JSON.stringify(this.loginForm.value));
          localStorage.setItem('rememberCurrentUser', 'true');
        }

        this.service.signin(this.loginForm).subscribe(res=>{
          console.log(res);
          if(res["success"]==true){
            this.service.ResetUserData.username= res["username"];
            this.fullName = res["username"];
            this.service.setname(this.fullName);
            this.route.navigate(['dashboard']);
          }
          else{
            this.msg="Invalid credentials..Check again";
          }
        })
      } else {
        this.loginForm.markAllAsTouched();
        console.log("empty form")
        }
    }
}
