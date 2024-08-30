import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SdlcService } from '../service/sdlc.service';
import { ApiService } from '../service/api.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


interface Item {
  phase: string;
  lifecycle: number | null;
}

@Component({
  selector: 'app-sdlc',
  templateUrl: './sdlc.component.html',
  styleUrls: ['./sdlc.component.scss']
})

export class SdlcComponent implements OnInit{

isEditing = true;
isSaved = false;
originalFormValue:(number | null)[]  = [];
originalFormValueExits= false;
RfpNum: number;

items: Item[] = [
  { phase: 'Analysis/Requirement', lifecycle: null},
  { phase: 'Design', lifecycle: null},
  { phase: 'Construction', lifecycle: null},
  { phase: 'Build', lifecycle: null},
  { phase: 'Unit test', lifecycle: null},
  
];
constructor(private fb: FormBuilder, private service: SdlcService, private router:Router, private apiService: ApiService,private toastr:ToastrService) { }

ngOnInit(): void{
  this.RfpNum= this.apiService.getRfp();
  console.log(this.RfpNum)
    this.service.fetchSdlcItems(this.RfpNum).subscribe(Response=>{
      console.log(Response);
      if(Response.length!=0){
        this.isEditing = true;
        this.isSaved = true;
        this.originalFormValueExits= true;
        this.total=100;

        let lifecycleArray: number[];
        lifecycleArray= Response.map((item: { lifecycle: any; })=>item.lifecycle.N);
        console.log("lifecycleArray (res from be):",lifecycleArray);
        this.originalFormValue= lifecycleArray;
        console.log("originalFormValue:",this.originalFormValue);

          for(let i=0;i<this.items.length;i++){
            if('lifecycle' in this.items[i]){
              (this.items[i] as {lifecycle: number | null}).lifecycle= this.originalFormValue[i];
              
            }
          }
      }
        
    })   
    console.log("form's value:",this.items)

}

  lifecycle: number[] = new Array(this.items.length).fill(0);
  total: number = 0;

  updateTotal() {
    console.log("pre existing values:",this.items)
    this.total = this.items.reduce((sum, items) => sum + Number(items.lifecycle), 0);
    
    if (this.total !== 100) {
      
    }
    console.log(this.total)
  }

  saveDataToDynamoDB() {
    console.log(this.items)
    
    console.log(this.total)
    for(const item of this.items){
      console.log(item.lifecycle)
      if(item.lifecycle==null){
        item.lifecycle=0;
    }}
   

    if (this.total == 0) {
      this.toastr.warning("Check the values of lifecycle ")
    }
    else if (this.total < 100) {
      this.toastr.warning("oops! Total should add up to 100%")
    }
    else if (this.total == 100) {
      console.log(this.originalFormValue);
      if(this.originalFormValue.length==0){
        this.service.saveSdlcItem(this.items, this.RfpNum).subscribe(response => {
          console.log('Data saved successfully:', response);
       
        for(const item of this.items){
          console.log(item.lifecycle)
          if(item.lifecycle==null){
            item.lifecycle=0;
          }
          this.originalFormValue.push(item.lifecycle);
        }
        
        this.isEditing = true;
       
        this.isSaved = true;
        this.originalFormValueExits= true;
        console.log(this.originalFormValue);
        this.toastr.success("Saved succesfully")
        

        });
        
      }
      else{
        console.log(this.originalFormValue);
        console.log("items to be updated:",this.items);
        this.service.updateSdlcItem(this.items, this.RfpNum).subscribe(response => {
          console.log('Data updated successfully:', response);
          this.toastr.success("  updated succesfully")
       
        this.originalFormValue=[];
        for(const item of this.items){
          console.log(item.lifecycle)
         
          if(item.lifecycle==null){
            item.lifecycle=0;
          }
          this.originalFormValue.push(item.lifecycle);
        }
        
        this.isEditing = true;
      
        this.isSaved = true;
        this.originalFormValueExits= true;
        console.log(this.originalFormValue);
        // this.toastr.success("Updated successfully")
       

        });
        }
      
    }
    
    else {
      this.toastr.warning("oops! total is greater than 100%");
    }
  }
 
 
 
  cancelEdit() {
    
    this.isEditing = false;
    this.isSaved = true;
    this.total=100;
    for(let i=0;i<this.items.length;i++){
      if(i< this.originalFormValue.length){
        this.items[i] .lifecycle= this.originalFormValue[i];
        console.log(this.originalFormValue[i]);
      }
    }
    console.log("old values",this.originalFormValue);
    
  }
 
  moveToNextPage() {
    this.router.navigate(['/setup/metrics']);
  }
 
 
}


