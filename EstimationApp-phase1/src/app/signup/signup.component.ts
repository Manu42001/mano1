import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Validators} from '@angular/forms';
import { LoginService } from '../service/login.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  fullName:string='';


  constructor(private fb: FormBuilder,private reg: LoginService) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formValues = this.signupForm.value;
      console.log('Form Values:', formValues);
      this.reg.NewUserData.username = this.signupForm.get('username')?.value;
      this.reg.NewUserData.email = this.signupForm.get('email')?.value;
      this.fullName = this.signupForm.get('username')?.value;
      this.reg.setname(this.fullName); 
      this.reg.setWelcomeBack(true);
      
    }
  }
}






