import { Component,NgZone,TemplateRef, ViewChild,} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditcompComponent } from '../editcomp/editcomp.component';
import { DataService } from '../service/data.service';

interface TransformedData {
    [key: string]: any[];
    }

   @Component({
    selector: 'app-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss'],
  })
    
  export class DataComponent  {
      formsArray: FormGroup[] = [];
      componentsArray: string[][] = [];
      subComponentsArray:string[][] = [];
      componentInputVisible: boolean[] = [];
      showErrorMessageArray: boolean[] = [];
      usedComponentsArray: string[][] = [];
      showComponentErrorMessageArray: boolean;
      editModes: boolean[] = [];
      editSubModes: boolean[] = [];
      componentAdded: boolean = false;
      RfpNum: number;
      rfpToDel: number;
      ProductName: string;
      router: any;
      DataList: any[]=[];
      ComponentsList: any[]=[];
      transformedData: TransformedData ={};
      filterData: string = '';
      filteredData:FormGroup[]=[];
      formsArray1:FormGroup[]=[];
      @ViewChild('openme') openme: TemplateRef<any> | any;
      ShowTable: boolean;
      form: FormGroup<any>;
      checkboxcomp: string[] = [];
      isCheckboxSelected: boolean = false;
      formValuesCopy:any;
      activeSubComponentIndex: number = -1;

constructor(private fb: FormBuilder,
        private zone: NgZone,
        private dialog: MatDialog,
        private toastr:ToastrService,
        private dataService: DataService,
        private apiService: ApiService
        ) {}
     
ngOnInit(): void {
        this.form = this.fb.group({
          Components: ['',Validators.required],
          subComponents: this.fb.array([]) 
        });
        this.addSubComponentField();
        console.log("componentInputVisible:",this.componentInputVisible)
        console.log("editModes:",this.editModes)
        console.log("formsArray:",this.formsArray)
        this.RfpNum= this.apiService.getRfp();
        this.ProductName= this.apiService.getAirline();
        console.log("inside data init",this.RfpNum);
        this.displayTables();
        this.applyFilter()
        this.dataService.setDisplayTablesFunction(()=> this.displayTables()) 
      }

getControls() {
  return (this.form.get('subComponents') as FormArray).controls;
}

addSubComponentField() {
  const newComp = this.form.get('Components')?.value;
  const usedComponents = Object.keys(this.transformedData).map(comp => comp.toLowerCase());
  const isDuplicate = usedComponents.includes(newComp.toLowerCase());
 
  if (isDuplicate) {
    this.showComponentErrorMessageArray = true;
    this.componentAdded = true;
    setTimeout(() => {
      this.zone.run(() => {
        this.showComponentErrorMessageArray = false;
      });
    }, 2000);
  } else {
    const subComponentsArray = this.form.get('subComponents') as FormArray;
    subComponentsArray.push(this.fb.control(''));
    this.activeSubComponentIndex = subComponentsArray.length - 1;
  }
 
  console.log(this.form);
}

isSubComponentValid():boolean{
  const   subcomp =this.form.get('subComponents')?.value.trim();
  console.log(subcomp);
  return subcomp !==' '; 
}

isAddSubComponentButtonDisabled():boolean{
  return !this.isSubComponentValid();
}


removeSubComponentField(index: number) {
  console.log(index)
  const subComponentsArray = this.form.get('subComponents') as FormArray;
  subComponentsArray.removeAt(index);
  this.activeSubComponentIndex = subComponentsArray.length - 1;
  console.log("at remove activeSubComponentIndex :",this.activeSubComponentIndex)
}

addComponent1(){
  console.log(this.form.get('Components'))
}

submit() {
  if(this.form.valid){
  this.formValuesCopy = {...this.form.value};
  console.log(this.formValuesCopy)
  this.formValuesCopy.subComponents = this.formValuesCopy.subComponents.filter((value: string) => value.trim() != '')
  console.log(this.formValuesCopy)
  const subComponentsArray = this.formValuesCopy.subComponents || [];
  console.log(subComponentsArray)
  const isDuplicateSubComponent = this.hasDuplicate(subComponentsArray);
  if (isDuplicateSubComponent) {
    this.toastr.error("Duplicate subcomponent detected");
    return;
  }
  
  if (subComponentsArray.length === 0) {
    this.toastr.error("At least one subcomponent is required");
    return;
  }

  this.formValuesCopy['RfpNum'] = this.RfpNum;
  if (this.isValidFormData()) {
    this.dataService.dataPostApi(this.formValuesCopy).subscribe(
      (response: any) => {
        console.log(response);
        if (response["success"] == true) {
          console.log("data response", response);
          this.displayTables();
          this.toastr.success("Component added successfully");
        }
      }
    );
  }
}
this.reset();
}
reset(){
  this.form.reset();
  const subComponentsArray1 = this.form.get('subComponents') as FormArray;
  subComponentsArray1.clear();
  console.log(subComponentsArray1)
  subComponentsArray1.push(this.fb.control(''));
  this.activeSubComponentIndex = 0;
} 
hasDuplicate(array: any[]): boolean {
  const lowerCaseValues = array.map(value => value.toLowerCase());
  const uniqueValues = new Set(lowerCaseValues);
  return array.length !== uniqueValues.size;
}

isValidFormData():boolean{
  return Object.values(this.formValuesCopy.Components&&this.formValuesCopy.subComponents).some(value=>value!== null&& value!=='')
}

displayTables() {
      this.dataService.fetchData(this.RfpNum).subscribe(
        (data) => {
          this.ShowTable = false;
          this.formsArray=[];
          console.log(this.formsArray)
          this.DataList = [];
          this.DataList = data;
          console.log(this.DataList);
          if(this.DataList.length>0){
            this.ShowTable= true;    
            this.transformedData = {};
            console.log(this.ShowTable)
          
            this.DataList.forEach((item) => {
              if (!this.transformedData[item.Components.S]) {
                this.transformedData[item.Components.S] = [];
              }
              this.transformedData[item.Components.S].push(item.subComponents.S);
            });
            console.log(this.transformedData)
            Object.keys(this.transformedData).forEach((key) => {
              const newForm = this.fb.group({
                component: key, 
                subComponents: this.fb.array(
                  this.transformedData[key].map((subComp: any) => this.fb.control(subComp)))
              });
              this.componentsArray.push([key]);
              const values = this.transformedData[key];
              this.subComponentsArray.push(values);
              this.editModes.push(false);
              this.editSubModes.push(false);
              this.formsArray.push(newForm);
              this.checkboxcomp = [];
            });
          }else{
            this.ShowTable= false;
            console.log(this.ShowTable)
          }
          console.log("editModes after push:",this.editModes)
          console.log("editModes after push:",this.editSubModes)
          console.log(this.subComponentsArray)
          this.applyFilter()
        }
        
      );
    
     }
     
   
check(k: string) {
        var t = false
        for (let g of this.ComponentsList) {
          if (k == g) {
            t = true
            break;
          }
        }
        return t;
      }
     

openEditDialog() {
     
        if (this.checkboxcomp.length === 0) {
         
          this.toastr.error("Please select component to edit");
          return;
        }else if(this.checkboxcomp.length !== 1){
          this.toastr.error("Please select only one component to edit");
          return;
        }else{
        console.log(this.checkboxcomp[0])
        console.log(this.formsArray1)
        const i= this.formsArray1.findIndex(FormGroup => FormGroup.value.component == this.checkboxcomp[0])
        console.log(i)
        if(i !== -1){
          const dialogRef = this.dialog.open(EditcompComponent, {
            data: {
              formsArrayData: this.formsArray1[i],
              datals: this.DataList
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result && result.length > 0) {
             
            } else {
             
            }
          });
        }
        else{
          console.log("dog")
        }}
       
    }
  

checkbox(i:number,form:FormGroup){
        const componentControl7 = form.get('component');
        const delComponentValue = componentControl7?.value?.trim();
        console.log(delComponentValue);
        const index = this.checkboxcomp.indexOf(delComponentValue);
        if (index === -1) {
          this.checkboxcomp.push(delComponentValue);
        } else {
          this.checkboxcomp.splice(index, 1);
        }
        console.log(this.checkboxcomp);
        this.isCheckboxSelected = this.checkboxcomp.length > 0;
      }


    
navigateToNextPage() {
      this.router.navigate(['/estimation']); 
    }
   
    deleteTables() {
      if (this.checkboxcomp.length > 0) {
        console.log("delete table");
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: "Delete",
            buttonText: {
              yes: "Yes",
              no: "Cancel"
            }
          }
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            for (const item of this.DataList) {
              console.log("inside data", item);
              if (item.Components.S === this.checkboxcomp[0]) {
                this.rfpToDel = item.rfp_no.N;
                console.log(this.rfpToDel);
                break;
              }
            }
           
            for (let comp of this.checkboxcomp) {
              this.dataService.deleteCompTable(comp, +this.rfpToDel).subscribe(
                (response: any) => {
                  console.log(response);
                  if (response["success"] == true) {
                    this.displayTables();
                    this.componentsArray.splice(1);
                    console.log(this.componentsArray);
                    this.subComponentsArray.splice(1);
                    console.log(this.componentsArray, "ddd");
                  } else {
                    console.log("Something went wrong!");
                  }
                 
                  this.checkboxcomp = [];
                },
                error => {
                  console.log("Error:", error);
                }
              );
            }
           
           
            this.toastr.success("Component table(s) deleted successfully");
          }
        });
      } else {
        this.toastr.error("Please select components to delete");
      }
    } 

applyFilter(){
      const value = this.filterData.toLowerCase();
      console.log(value);
      console.log(this.formsArray);
      this.filteredData = this.formsArray1.filter(item => item.value.component.toLowerCase().startsWith(value));
      console.log(this.filteredData)
      if(value.trim()=='' || value == null)
      this.formsArray1=this.formsArray
      else
      this.formsArray1=this.filteredData

    }
openme1(): void {
      console.log('hi')
      this.dialog.open(this.openme,
        {
          data: {
          }
        });
    }
closeDialog(): void {
      this.dialog.closeAll();
      this.reset()
    }
    }