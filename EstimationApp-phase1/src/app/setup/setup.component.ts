import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  encapsulation: ViewEncapsulation.None, 
})


export class SetupComponent implements OnInit{
 
  selectedPage = 'sdlc';
  selectedTabIndex = 0; 
  tabGroup: any;
  currentDropdownIndex: number = 0;
  dropdowns: any;
  isNextButtonDisabled: boolean = false;
  cdr: any;
 

  constructor(private router:ActivatedRoute ){}

  ngOnInit(){
    this.router.queryParams.subscribe(params => {
      const tabIndex = params['tab'];
      if (tabIndex === 'setup') {
        // Set the selected tab index to navigate to the "Effort Estimation" tab
        this.selectedTabIndex = 1; // Assuming "Effort Estimation" is the second tab (index 1)
      }
    });
  }
  getMatPanelTitleClass(pageName: string) {
    if (pageName === 'sdlc' && this.selectedTabIndex === 0) {
      return 'active-title';
    }
    if (pageName === 'metrics' && this.selectedTabIndex === 0) {
      return 'active-title';
    }
    if (pageName === 'data' && this.selectedTabIndex === 0) {
      return 'active-title';
    }
    if (pageName === 'allocation' && this.selectedTabIndex === 0) {
      return 'active-title';
    }
    if(pageName === 'set-allocation' && this.selectedTabIndex === 0) {
      return 'active-title';
    }
    return '';
  }
 
  
  goToNextDropdown() {
    if (this.currentDropdownIndex < this.totalDropdowns - 1 && !this.isNextButtonDisabled && this.currentDropdownIndex < 2) {
      this.isNextButtonDisabled = true;
      this.currentDropdownIndex++;
    this.isNextButtonDisabled = false;
    this.cdr.detectChanges();
   
    }
    this.currentDropdownIndex++;
  }

  get totalTabs(): number {
    return 2;
  }

  get totalDropdowns(): number {
    return 3;
  }



  backgroundColor: string = 'rgba(0, 0, 0, 0.38)';
  background:boolean=true
  background1:boolean=true
  background2:boolean=true
  background3:boolean=true
  toggleBackgroundColor() {
   
    this.background=false
  }
  toggleBackgroundColor1() {
   
    this.background1=false
  }
  toggleBackgroundColor2() {
    // this.backgroundColor = this.backgroundColor === 'rgba(0, 0, 0, 0.38)' ? '#007acc' : '#007acc';
    this.background2=false
  }
  toggleBackgroundColor3()
  {
    this.background3=false
  }
}