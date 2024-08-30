import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class forgetComponent {
  ResetForm: FormGroup; // Create a FormGroup
  email:string='';
  msg: string;
  fullName: any;

  constructor(private fb: FormBuilder, private service: LoginService, private router: Router) {
    this.ResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Add a method to handle form submission
  onSubmit() {

    if (this.ResetForm.valid) {
      console.log('data to be push', this.ResetForm.value);
      this.service.ResetUserData.email = this.ResetForm.get('email')?.value;
// check email exits
      this.service.resetPassword(this.service.ResetUserData.email).subscribe(res=>{
        console.log(res);
        if(res["success"]==true){
          this.service.ResetUserData.username= res["username"];
          this.fullName = res["username"];
          this.service.setname(this.fullName);
           // check whether the entered email id is valid, if valid then reset password link
          //  will be sent to that mail id, if they click that link then they will be navigate to the password page 
          swal.fire("Please check it!",
          "Link is sent to your registered mail id ",
          "success").then(()=>(this.router.navigate(['/password'])))
        }
        else{
          this.msg="Invalid email id..Check again";
        }
      })

    } else {
      // The form is invalid, handle the error or display a message
      console.log('Invalid email');
    }
  }
}
