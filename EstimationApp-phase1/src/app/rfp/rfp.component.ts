import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';
import { concatMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
 
 
 
@Component({
 selector: 'app-rfp',
 templateUrl: './rfp.component.html',
 styleUrls: ['./rfp.component.scss']
})
 
export class RfpComponent {
 rfpForm: FormGroup;
 minDate: string;
 showForm: boolean=false;
 msg: string;
 rfp: number=1;
 localProduct: string;

 constructor(private apiservice:ApiService,private dialog:MatDialog,private reg: LoginService,private router:Router, private fb: FormBuilder,private toastr:ToastrService, private dataservice:DataService) {
 
  const today = new Date();
   const year = today.getFullYear();
   const month = today.getMonth() + 1;
   const day = today.getDate();
   this.minDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
 
   this.rfpForm = this.fb.group({
    product: ['', Validators.required],
    date: ['', Validators.required],
  });
  }
  capitalizeFirstLetter(inputString: string): string {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }
 
 

openForm() {
  this.showForm = true;
  console.log("joo")
}
closeForm() {
  this.showForm = false;
}
 
 onSubmit() {
   if (this.rfpForm.valid) {
     const FormData=this.rfpForm.value;
     const fullName = this.capitalizeFirstLetter(this.reg.getname());
     console.log(FormData);
     const combinedRfpData={
      product: FormData["product"],
      date:FormData["date"],
      fullName: fullName
     }
     console.log(combinedRfpData);
     this.apiservice.rfpPost(combinedRfpData).pipe(
      concatMap((response) => {
        console.log(response);
        if (response["success"] === true) {
          this.apiservice.setRfp(response["rfpNo"], response["product"]);
          const toast = this.toastr.success("Form submitted successfully");
          this.localProduct = this.apiservice.getRfpProduct();
          toast.onShown.subscribe(() => this.rfpForm.reset());
         
        } else {
          this.msg = "RFP already exists";
        }
        // Return an observable to trigger the next step
        console.log(this.rfp,this.localProduct)
        return this.apiservice.copyOfRecord(this.rfp, this.localProduct);
      })
     ).subscribe(
      (response) => {
        if (response['success'] === true) {
          console.log("copied");
          this.router.navigate(["setup"]);
          this.closeDialog();
        }
      },
      (error) => {
        this.toastr.error("Something went wrong");
        console.log(error);
      }
     );
   } else {
     this.rfpForm.markAllAsTouched();
   }
   this.closeForm();

  }
  closeDialog(): void {
    this.dialog.closeAll();
   
  }
}
