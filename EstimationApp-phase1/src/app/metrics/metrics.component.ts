import { Component,OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MetricsService } from '../service/metrics.service';

export interface metrics{
  isSelected: () => boolean;
  Size:number;
  Complexity:string;
  Phase:string;
}
 
@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})

export class MetricsComponent implements OnInit{
 
  @ViewChild('inputcolumn1') inputcolumn1:any;
 
  Size: string[] = [];
  Complexity: string[] = [];
  isCompChecked:boolean=false;
  isSizeChecked:boolean=false;
  CheckAll:boolean=false;
  isEditing = false;
  dictionaryData : any[] = [];
  isSaveButtonEnabled : boolean = false;
  selectedPhase :string ='';
  Phases : string[]=[];
  ShowTable:boolean=false
  selectedProjects: string[]=[];
  uniqueProjects: string[]=[];
  only1Selected: boolean=false;
  showEditIcon: boolean=false;
  checkedPhase:any[]=[];
  isFormValid:boolean=false;
  phasedata:string="";
  sizedata:any[]=[];
  complexitydata:any[]=[];
  loadComp: boolean= false;
  loadSize: boolean =false;
  isHours: boolean= true;
  afterdel: boolean= false;
  ProductName: string;
  hours:number=0;
  editIndex: number | null = null;
  RfpNum: number;
  dataSource: MatTableDataSource<metrics, MatTableDataSourcePaginator>;
  filterPhase: string = '';
  filteredData: any[]; 

 phaseFormControl = new FormControl('', [Validators.required]);

   isFormSubmitted: any;
  

  constructor(private apiService: ApiService, 
    private metricService: MetricsService, 
    private toastr: ToastrService, 
    private router:Router,
    private http:HttpClient, 
    private dialog: MatDialog) 
  {
  }
 
  ngOnInit(): void {
    
    this.http.get<string[]>('assets/phase.json').subscribe((jsonData) =>{
      this.Phases = jsonData
      console.log(this.Phases)
    });
    this.RfpNum= this.apiService.getRfp();
    this.ProductName= this.apiService.getAirline();
    console.log("inside metrics init",this.RfpNum)
    this.fetchData();
  }
  
  onInputChange(val:any){
    console.log(val)
  }
  onSelectProject(phaseName: string) {
    if(this.selectedProjects.length == 1){ 
      this.isEditing = false;
    }else{
      this.isEditing = true;
    }
 
    const index = this.selectedProjects.indexOf(phaseName);
    if (index !== -1) {
      this.selectedProjects.splice(index, 1);
    } else {
      this.selectedProjects.push(phaseName);
    }
    console.log(this.selectedProjects)
    if(this.selectedProjects.length == 1){
    }
    else if(this.selectedProjects.length != 1){
    }
  }
 
  isProjectSelected(phaseName: string): boolean {
    return this.selectedProjects.includes(phaseName);
  }
  SelectAllProjects(f:boolean){
    console.log(f);
    if(f == true){
      this.selectedProjects = this.uniqueProjects;
    }
    else{
      this.selectedProjects = [];
    }
   
  }
 
  fetchData()
  {
    this.metricService.fetchDictionaryData(this.RfpNum).subscribe(data => {
      this.dictionaryData = data;
      this.filteredData = data;
      console.log("dictionaryData",this.dictionaryData);
      if(this.dictionaryData.length>0){
          this.ShowTable= true;
          this.checkSaveButtonStatus();      
      }
     
      else{
        this.ShowTable= false;
      }
      for (let g of data) {
        console.log(g.phase.S)
        if (!(this.check(g.phase.S))) {
          this.uniqueProjects.push(g.phase.S)
        }
      }
      console.log("UQ inside fetch",this.uniqueProjects);
     
      });
    }
check(k: string) {
  var t = false
  for (let g of this.uniqueProjects) {
    if (k == g) {
      t = true
      break;
    }
  }
  return t;
}

async deletePhase() {
  if (this.selectedProjects.length === 0) {
    this.toastr.error("Please select phases to delete");
    return;
  }
  
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      message: 'Delete',
      buttonText: {
        yes: 'Yes',
        no: 'Cancel'
      }
    },
  });

  console.log("selectedProjects in del:", this.selectedProjects);
  
  
  const result = await dialogRef.afterClosed().toPromise();

  if (result === true) {  
    if (this.selectedProjects.length > 0) {
      for (let p of this.selectedProjects) {
        try {
          const res = await this.metricService.deleteMetrics(p, this.RfpNum).toPromise();
          console.log(res);
          const index = this.uniqueProjects.indexOf(p);
          if (index !== -1) {
            this.uniqueProjects.splice(index, 1);
          }

          console.log("inside deletePhase", this.uniqueProjects);

          if (res["success"] == true) {
            this.fetchData();
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (this.afterdel) {
        console.log("Phase editing in progress");
      } else {
        this.toastr.success("Phase Deleted Successfully");
      }

      this.selectedProjects = [];
    } else {
      console.log("No Phase got selected");
    }
  } else {
    console.log("User clicked 'Cancel'");
    
  }
}




  checkSaveButtonStatus() {
    this.isSaveButtonEnabled = this.dictionaryData.every(item => item.hours.N !== null && !isNaN(item.hours.N));//something number
    console.log(this.isSaveButtonEnabled);
 
   
}
 

 async AddPhase() {
  
 await this.deletePhaseWithoutConfirmation();

 
  this.isFormValid = false;
  const inputPhase = this.selectedPhase.toLowerCase();
  console.log(inputPhase);

  console.log(this.uniqueProjects);
  if (this.uniqueProjects.length === 0) {
    console.log("if empty");
  } else {
    let PhaseAlreadyExists = false;
    for (let u of this.uniqueProjects) {
      console.log(u);
      const existingPhase = u.toLowerCase();
      if (inputPhase === existingPhase) {
        this.toastr.warning("Phase already exists");
        console.log("else contains");
        PhaseAlreadyExists = true;
        break;
      }
    }
    if (!PhaseAlreadyExists) {
      this.uniqueProjects.push(this.selectedPhase);

      if (this.isSizeChecked) {
        this.Size = ["Small", "Medium", "Large"];
      }
      if (this.isCompChecked) {
        this.Complexity = ["Low", "Medium", "High"];
      }
      const requestData = {
        Size: this.Size,
        Complexity: this.Complexity,
        Phase: this.selectedPhase,
        RfpNum: this.RfpNum,
        Product: this.ProductName,
        Hours: this.hours
      };

      this.metricService.callApi(requestData).subscribe(
        (response: any) => {
          console.log(requestData);
          console.log(response);
          if (response["success"] == true) {
            console.log('API Response:', response);
            this.fetchData();
            if (this.afterdel) {
              this.toastr.success("Phase Edited succesfully");
            } else {
              this.toastr.success("Phase Inserted succesfully");
            }
            this.resetFormInput();
          }
        },
        (error: any) => {
          console.error('API Error:', error);
          this.toastr.warning('Oops! Something went wrong');
        }
      );
    }
  }
}


async deletePhaseWithoutConfirmation() {
  if (this.selectedProjects.length > 0) {
    for (let p of this.selectedProjects) {
      try {
        const res = await this.metricService.deleteMetrics(p, this.RfpNum).toPromise();
        console.log(res);
        const index = this.uniqueProjects.indexOf(p);
        if (index !== -1) {
          this.uniqueProjects.splice(index, 1);
        }

        console.log("inside deletePhase", this.uniqueProjects);

        if (res["success"] == true) {
          this.fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (this.afterdel) {
      console.log("Phase editing in progress");
    } else {
      this.toastr.success("Phase Deleted Successfully");
    }

    this.selectedProjects = [];
  } else {
    console.log("No Phase got selected");
  }
}

  cancelEdit() {
   
    this.fetchData();
  }
  onEdit(index:number){
    this.editIndex = index;
    console.log(this.editIndex)
  }
  onSave(index: number, editRow:string){
    this.editIndex = null;
    for(const item of this.dictionaryData){
          if(editRow == item.index.S){
            console.log(item.hours.N)
            this.addNewKeyValuePair();
            console.log("king")
          }
        }  
 
  }
  isFieldEditable(index: number):boolean{
    return this.editIndex === index;
  }
  addNewKeyValuePair() {
      console.log(this.dictionaryData);
        this.metricService.PostdictionaryData(this.dictionaryData,this.RfpNum).subscribe(Response => {
            console.log(Response);
            }, error => {
                console.log(error)
            })
  }
 
  resetFormInput(){
    this.Size=[];
    this.Complexity=[];
    this.selectedPhase='';
    this.isCompChecked = false;
    this.isSizeChecked = false;
    this.afterdel = false;
  }
 
  moveToNextPage() {
      this.router.navigate(['/data']);
  }
 
  loadData(){
    if (this.selectedProjects.length === 0) {
      
      this.toastr.error("Please select Phase to edit");
      return;
    }else if(this.selectedProjects.length !== 1){
      this.toastr.error("Please select only one phase combination to edit");
      return;
    }
    this.afterdel = true;
    this.selectedPhase=this.selectedProjects[0];
    console.log(this.selectedProjects);
    for(let element of this.dictionaryData){
      if(element.phase.S == this.selectedPhase){
        this.sizedata.push(element.size);
        this.complexitydata.push(element.complexity)
      }
    }
    console.log(this.selectedPhase)
    console.log( this.complexitydata)
    console.log(this.sizedata)
    if( (this.complexitydata[0].S !== 'NA') && (this.sizedata[0].S !== 'NA') ){
      this.loadComp = true;
      this.loadSize = true;
    }
    else if ( (this.complexitydata[0].S !== 'NA') && (this.sizedata[0].S === 'NA') ){
      this.loadComp = true;
      this.loadSize = false;
      console.log(this.loadSize);
      console.log(2);
    }
    else
    {
      this.loadSize = true;
      this.loadComp = false;
      console.log(3);
    }
    console.log(this.loadComp);
    console.log(this.loadSize);
    this.isSizeChecked=this.loadSize;
    this.isCompChecked=this.loadComp;
    this.resetLoad()
    this.validateForm();
  
  }
 
  validateForm() {
    const phaseValue = (document.getElementById('phase') as HTMLInputElement)?.value.trim() || this.selectedPhase;
    const hasSizeOrCompChecked = this.isCompChecked || this.isSizeChecked;
    this.isFormValid = !!phaseValue && (hasSizeOrCompChecked || this.isCompChecked || this.isSizeChecked)
    if (phaseValue) {
  
      this.phaseFormControl.setErrors({ customError: true });
    } else {
      
      this.phaseFormControl.setErrors(null);
    }
    }
  
    resetLoad(){
    this.sizedata= [];
    this.complexitydata=[];
    this.loadComp = false;
    this.loadSize = false;
  }
 
applyFilter() {
  const value = this.filterPhase.toLowerCase();
  this.filteredData = this.dictionaryData.filter(item => item.phase.S.toLowerCase().includes(value));
  console.log(this.filteredData)
 }
}