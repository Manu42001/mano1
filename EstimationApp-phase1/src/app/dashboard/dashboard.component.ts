import { Component, Input, ViewChild } from '@angular/core';
import { LoginService } from '../service/login.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Chart, registerables } from 'node_modules/chart.js';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RfpComponent } from '../rfp/rfp.component';
import { inlineService } from '../service/inline.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  effortpdf:any;
  displayedColumns: string[] = [
    'project-name',
    'Created',
    'Est',
    'Date',
    'Groups',
    'Copy_Record',
    'More',
  ];

  dataSource = new MatTableDataSource<any>();
  datatobeexported:any[]=[];
  dataSource1 = new MatTableDataSource<Users>();

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  welcomeBack: any;
  totalProjectsCount: number;
  estihrs: string;

  ngAfterViewInit():void {
    this.dataSource.paginator = this.paginator;
  }

  @Input() name: any;
  fullName: string = '';
  firstletter = '';
  page:any;
  newProjectsCount: number;
  closedProjectsCount: number;

  constructor(private apiService:ApiService,private inlineService: inlineService, private reg:LoginService,private router:Router, private dialog: MatDialog) {}
  capitalizeFirstLetter(inputString: string): string {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }

  ngOnInit() {
    this.welcomeBack=this.reg.getWelcomeBack();
    this.fullName = this.capitalizeFirstLetter(this.reg.getname());
    console.log(this.fullName)
    this.firstletter = this.fullName.charAt(0);
    this.get_data();
    this.inlineService.fetchrfpdash().subscribe((response:any)=>{
    this.dataSource.data=response;
    this.dataSource.paginator = this.paginator;
    console.log("length", response.length)
    this.totalProjectsCount = response.length;
    console.log("ds",this.dataSource)
    const filteredDataCount = this.countDataForCurrentWeek(response);
    this.newProjectsCount = filteredDataCount;
    this.closedProjectsCount = this.totalProjectsCount-this.newProjectsCount;
    });
   
    this.lineChart();
    this.donut();
    this.bar();
  }

countDataForCurrentWeek(data: any[]) {

    const currentDate = new Date();
    const currentWeek = this.getISOWeek(currentDate);
    console.log("data",data)
    // Use the filter method to count the data for the current week
    const filteredData = data.filter((item) => {
      if (item.date) {
        const projectDate = new Date(item.date);
        const projectWeek = this.getISOWeek(projectDate);
        return projectWeek > currentWeek;
      }
      return false; // Return false if the 'date' property is missing or not a valid date
    });
    return filteredData.length;
  }

   calculatetotalProjectsCount() {  

    this.totalProjectsCount = this.dataSource.data.length;

    console.log("count",this.totalProjectsCount)

  }
  

  filterProjectsByDate(selectedDate: string) {

    const filteredProjects = this.dataSource.data.filter((project) => project.date === selectedDate);

    this.totalProjectsCount = filteredProjects.length;

    const newProjectsCount = filteredProjects.filter((project) => project.isNew).length;

    const closedProjectsCount = this.totalProjectsCount - newProjectsCount;

    this.newProjectsCount = newProjectsCount;

    this.closedProjectsCount = closedProjectsCount;

  }

    countProjectsForCurrentWeek(dataSource: MatTableDataSource<any>):number {

      console.log("inside the Current" , dataSource.data)

    const currentDate = new Date(); // Get the current date

    const currentWeek = this.getISOWeek(currentDate); // Get the ISO week number of the current date

    this.dataSource.filterPredicate = (data: any, filter1: string) => {

      

      return data['project-name'].toLowerCase().includes(filter1.toLowerCase());

    };

    const projectsForCurrentWeek = dataSource.data.map((project) => {

     

      console.log("1.Project Date" , project.date)

     if(project.date != null){

 

      const projectWeek = this.getISOWeek(project.date);

      return projectWeek === currentWeek;

     }

     console.log("no date")

     return null;

    });

  console.log("Current Week Prjects",projectsForCurrentWeek.length)

    return projectsForCurrentWeek.length;

  }

 
get_data(){
  this.inlineService.fetchrfpdash().subscribe((response:any)=>{
    console.log(response);

    this.dataSource.data=response;
    console.log("datasource.DATA:",JSON.stringify(this.dataSource.data));
  
  });
}
  

 

  onclickEdit(RfpNum:number, product:string):void{
    console.log('clicked rfp_no:',RfpNum);
    this.apiService.setRfp(RfpNum, product);
    // this.router.navigate(['steps'])
    this.router.navigate(["setup"],{queryParams:{ tab: "effort-estimation"}});
  
  }

 
  getISOWeek(date: string | number | Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    return Math.ceil((((d as any) - (new Date(d.getFullYear(), 0, 1) as any)) / 8.64e7 + 1) / 7);
  }

 
  applyFilter(event: Event) {
console.log("event",event)
    const filterV = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterV.trim().toLowerCase();
    console.log("cdfgvh",this.dataSource.filter = filterV.trim().toLowerCase())

  }

  lineChart() {
    new Chart('myChart1', {
      type: 'line',
      data: {
        labels: ['', '', '', '', '', ''],
        datasets: [
          {
            label: 'Monthly Project',
            data: [1, 12, 1, 15, 10, 3],
            borderWidth: 1,
            tension: 0.5,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
            // position: 'bottom',

            labels: {
              usePointStyle: true,

              pointStyle: 'rect',

              font: {
                size: 10,
              },
            },
          },
        },

        scales: {
          x: {
            ticks: {
              display: false,
            },

            grid: {
              drawOnChartArea: false,
            },
          },

          y: {
            ticks: {
              display: false,
            },

            beginAtZero: true,

            grid: {
              drawOnChartArea: false,

              drawTicks: false,
            },
          },
        },
      },
    });
  }


  bar(){
    new Chart('myChart2', {
      type: 'bar',
      data: {
        labels: ['A', 'UA'],
        datasets: [{
          // label: '# of Votes',
          data: [2, 8],
          borderWidth: 1,
          borderRadius:10,
          backgroundColor: [
            '#068EDB',
            'brown',

          ],
        }],

      },

      options: {
        plugins: {
          legend: {
            display: false,
            // position: 'bottom',

            labels: {
              usePointStyle: true,

              pointStyle: 'rect',

              font: {
                size: 30,
              },
            },
          },
        },

        scales: {
          x: {
            ticks: {
              display: true,
            },

            grid: {
              drawOnChartArea: false,
            },
          },

          y: {
            ticks: {
              display: false,
            },

            beginAtZero: true,

            grid: {
              drawOnChartArea: false,

              drawTicks: false,
            },
          },
        },
      },
    });
  }

  donut(){
    new Chart('myChart3', {
      type: 'doughnut',
      data: {
        labels: ['', ''],
        datasets: [
          {
            label: 'Monthly Project',
            data: [12, 19],
            borderWidth: 1,

          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
            // position: 'bottom',


          },
        },


      },
    });
  }


 
exportToPdf(a:Number, b:string, c:string) {
    var k=0;
    var count=0;
    this.datatobeexported=[];
    this.inlineService.fetchCombine(a).subscribe((response:any)=>{
      console.log(response);
      // this.datatobeexported = response;
      // let p=[];
 
      for (let g of response){
        let p=[]
        p.push(g["component"].S);
        p.push(g["subComponent"].S);
        p.push(g["referenceIndex"].S);
        p.push(g["hours"].S);
        p.push(g["estimation_type"].S);
        p.push(g["confidenceScale"].S);
        p.push(g["estimation_unit"].S);
        p.push(g["calculated"].N);
        p.push(g["adjusted"].N);
        p.push(g["totalEsti"].N);
        p.push(g["analysis"].N);
        p.push(g["design"].N);
        p.push(g["construction"].N);
        p.push(g["build"].N);
        p.push(g["unitTest"].N);
        k+=parseInt(g["totalEsti"].N)
        count+=1
       
        this.datatobeexported.push(p);
       
     }
      const doc = new jsPDF('p','pt','a1');
      var pk=(count)*35;
     
 
//const tableData = getDataForPDFTable(data);
 
const headers = ['Components', 'Sub Components','Phase Index','Hours','Estimation Type','Confidence','Units','Development Hours','Adjusted Hours','Total Estimation Hours','Analysis/Requirement','Design','Construction','Build','Unit_Test'];
autoTable(doc, {
  head: [headers],
  body: this.datatobeexported,
  tableWidth:'auto',
 
  theme:'grid',
  headStyles:{cellWidth:105},
  styles:{fontSize:9,cellPadding:5,}
  // styles:{valign:'LRC'}
  // didDrawPage: (dataArg) => {
  //  doc.text('PAGE', dataArg.settings.margin.left, 10);
  // }
});
this.estihrs="Total Estimation Hours: "+k;
if(this.datatobeexported.length>0)
    doc.text(this.estihrs,45,100+pk)
 
doc.save(c);
 
 
return doc;
 
 });
}
openNewRfpConfirmationDialog() {
  const dialogRef = this.dialog.open(RfpComponent, {
    data: {
      message: 'Are you sure you want to create a new RFP?',
      buttonText: {
        no: 'No',
        yes: 'Yes'
    
      }
    },
  });

  dialogRef.afterClosed().subscribe((result: boolean) => {
    if (result) {
      // Navigate to the "/rfp" route or perform any other action for creating a new RFP
      this.router.navigate(['/rfp']);
    }
  });
}
}

export interface Element {
  format: string;
  date: number;
  creator: number;
  // symbol: string;
}


export interface Users{

 

  Id:string,

 

  Roles:string,

 

  User_Name:string,

 

  Display_Name:string,

 

  Email:string,

 

  Groups:[]

 
  

}


function then(arg0: () => void) {
  throw new Error('Function not implemented.');
}

