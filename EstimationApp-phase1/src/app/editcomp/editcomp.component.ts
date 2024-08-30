import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-editcomp',
  templateUrl: './editcomp.component.html',
  styleUrls: ['./editcomp.component.scss']
})
export class EditcompComponent implements OnInit{
 
  // editableFormsArray: FormGroup[]= [];
  editForm: FormGroup;
  idToDel: number;
  rfpToDel: number;
  subComponentsArray:string[][] = [];
  DataList: any[]=[];
  rfpToUpdate: number;

constructor(@Inject(MAT_DIALOG_DATA) public data: any,  
    private fb: FormBuilder, 
    private dataService:DataService,
    private toastr:ToastrService,
    private dialogRef: MatDialogRef<EditcompComponent>) {
        console.log(data.formsArrayData);
        console.log(data.datals);
        this.DataList=data.datals;
}

ngOnInit() {
  console.log(this.data.formsArrayData);
  this.editForm = this.fb.group({
    comp: [this.data.formsArrayData.get('component')?.value, Validators.required],
    subcomp: this.fb.array([]),
    newsub: ''
  });
  const dynamicFieldsData = this.data.formsArrayData.get('subComponents') as FormArray;
   dynamicFieldsData.controls.forEach((con) => {
     (this.editForm.get('subcomp') as FormArray).push(this.fb.control(con.value));
   });
   console.log(this.editForm.get('comp'))
   console.log((this.editForm.get('subcomp') as FormArray).controls as FormControl[])
}
getControls() {
  return (this.editForm.get('subcomp') as FormArray).controls as FormControl[];
}

onSubmit(){
  const formValues = this.editForm.value;
  console.log(formValues);
  const oldc = this.data.formsArrayData.value.component;
  const olds = this.data.formsArrayData.value.subComponents;

  if (!formValues.subcomp || !Array.isArray(formValues.subcomp) || formValues.subcomp.length === 0) {
    this.toastr.error("At least one subcomponent is required");
    console.log("Error: No subcomponents provided");
    return; // Stop further execution
  }

  for(const item of this.DataList){
    console.log("inside data",item);
      if(item.Components.S === oldc){
        this.rfpToUpdate = item.rfp_no.N;
        console.log("update api items",this.rfpToUpdate);
        break;
  }}
  this.dataService.dataCompUpdateApi(+this.rfpToUpdate, oldc , formValues.comp, olds, formValues.subcomp).subscribe(
    (res:any)=>{
      if(res["success"] == true){
        console.log(res)
        this.toastr.success("Component updated successfully");
        this.closeDialog()
        const displayTablesFunction = this.dataService.getDisplayTablesFunction();
        if (displayTablesFunction) {
          displayTablesFunction();
        }
      }
    }
    )
}
closeDialog() {
  this.dialogRef.close();
}
addSubComponentField() {
  const subComponentsArray = this.editForm.get('subcomp') as FormArray;
  const newSub = this.editForm.get('newsub')?.value
  subComponentsArray.push(this.fb.control(newSub));
  console.log("before",subComponentsArray)
  this.editForm.get('newsub')?.setValue('')
  console.log(this.editForm.get('newsub'))
  console.log("after",subComponentsArray)
}
// Method to remove a specific subcomponent field
removeSubComponentField(index: number) {
  console.log("no",index)
  const subComponentsArray = this.editForm.get('subcomp') as FormArray;
  // const  subComponentsArray = this.form.controls.subComponents as FormArray
  subComponentsArray.removeAt(index);
}

// NOT IN USE
deleteSubComponent(form: FormGroup, formIndex: number) {
  console.log("no",formIndex)
  const subComponentsArray = this.editForm.get('subcomp') as FormArray;
  console.log(subComponentsArray.value);
  console.log(subComponentsArray.value[formIndex])
  console.log(this.DataList)
  for(const item of this.DataList){
      console.log("inside data",item);
    if(item.subComponents.S === subComponentsArray.value[formIndex]){
      this.idToDel = item.id.N;
      this.rfpToDel = item.rfp_no.N;
      console.log("delete api items",this.idToDel,this.rfpToDel);
      break;
  }
}
  
  this.dataService.deletesubcomponent(+this.idToDel ,+this.rfpToDel).subscribe(
    (response:any)=>{
      console.log(response);
      if(response["success"]==true){
        this.removeSubComponentField(formIndex);
        this.toastr.success("Subcomponent deleted successfully"); 
      }
      else{
        this.toastr.warning("Something went wrong!");
      }
    }
  )
}
}