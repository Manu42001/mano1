import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';


@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {
  @Input() name:any;
  fullName:string='';
  signupForm: FormGroup;
  // passwordsDoNotMatch: boolean;

  constructor(private fb: FormBuilder,private reg:LoginService, private router: Router) {
    this.signupForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
     { validators: this.passwordsMatchValidator });
}

passwordsMatchValidator(group: FormGroup){
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      // this.passwordsDoNotMatch= false;
      return null; // Passwords match 
    } else {
       // this.passwordsDoNotMatch= true;
       return { passwordsDoNotMatch: true }; // Passwords do not match
    }
  
}

capitalizeFirstLetter(inputString: string): string {
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

ngOnInit(){
  this.fullName = this.capitalizeFirstLetter(this.reg.getname());
}

onPaste(event: ClipboardEvent) {
  // Prevent pasting into the confirmPassword field
  event.preventDefault();
}

  onSubmit() {
    if (this.signupForm.valid) {
      this.reg.NewUserData.password = this.signupForm.get('password')?.value;
      this.reg.ResetUserData.password = this.signupForm.get('password')?.value;

      console.log("NewUserData",this.reg.NewUserData);
      console.log("ResetUserData",this.reg.ResetUserData);
      console.log(this.reg.ResetUserData.email)

      if(this.reg.ResetUserData.email){
        // this.ls['forgotpw'](forgotpwd).subscribe({
      this.reg.forgotPut(this.reg.ResetUserData).subscribe(
        {
      next:(result:any)=>swal.fire({title:"Password Reseted Successfully", icon:"success"}).then(()=>(this.router.navigate(['/signin']))),
      error:(error:any)=>swal.fire("Oops! Something went wrong!"),
      complete:()=>console.log("completed")
      }
      )
      }

      else{
        this.reg.signUp(this.reg.NewUserData).subscribe(
          (response) => {
            console.log("Successful registered",response);
            this.router.navigate(["dashboard"]);
          })
      }
    }
  }
}

