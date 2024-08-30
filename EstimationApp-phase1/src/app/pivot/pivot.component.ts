
  // Import necessary modules
import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PivotService } from '../service/pivot.service';
import { ApiService } from '../service/api.service';
import * as _ from 'lodash';


interface Employee {
  id: number;
  name: string;
  role: string;
}
 
@Component({
  selector: 'app-pivot',
  templateUrl: './pivot.component.html',
  styleUrls: ['./pivot.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PivotComponent implements AfterViewInit {

  rfp_no:number;
  uniqueHeader:string[]=[];
  datasource= new MatTableDataSource<any>();
  displayedColumns:string[]=[];
  data:any[];
  items:any[]=[];
  groupedData:any ={};
  sequenceTotals: { [key: number]: number } = {};

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  constructor(private service:PivotService, private apiService:ApiService){

  }
  ngAfterViewInit(): void {
    this.rfp_no = this.apiService.getRfp();
    this.fetchItems();
    
  }

  getKeys() {
    console.log("getkeys",Object.keys(this.groupedData))
    return Object.keys(this.groupedData);
  }

  fetchItems(){
    this.service.fetchPivot(this.rfp_no).subscribe(data=>{
     console.log(data)
     this.items=data;
     
     this.groupedData=_.groupBy(this.items,'estimation_sequence.S')
     console.log("grouped data",this.groupedData)
     this.datasource.data=this.groupedData;
     console.log("data",this.datasource)

     const referenceIndexArray = this.items.map(item=>item.referenceIndex.S)
     console.log("referenceIndex",referenceIndexArray)
     for (let g of referenceIndexArray) {
        console.log(g)
        if (!(this.check(g))) {
          this.uniqueHeader.push(g)
        }
      }
      console.log(this.uniqueHeader.length)

       if (this.uniqueHeader.length>0){
        this.displayedColumns=["Sequence",...this.uniqueHeader,"Grand Total","With PM"]
        console.log("display columns",this.displayedColumns)
      }
      console.log("Unique Header:",this.uniqueHeader);
       });  


      }
      
    // this.datasource.paginator = this.paginator;
       
  // }

  check(k: string) {
    var t = false
    for (let g of this.uniqueHeader) {
      if (k == g) {
        t = true
        break;
      }
    }
    return t;
  }










































































  // data: { number: number, employees: Employee[] }[] = [
  //   { number: 1, employees: [{ id: 101, name: 'John Doe', role: 'Developer' }] },
  //   { number: 2, employees: [{ id: 202, name: 'Jane Smith', role: 'Designer' }] },
  //   // Add more data as needed
  // ];
 
  expandedRow: number | null = null;
 
  toggleExpansion(number: number): void {
    console.log("num",number)
    this.expandedRow = this.expandedRow === number ? null : number;
  }
}