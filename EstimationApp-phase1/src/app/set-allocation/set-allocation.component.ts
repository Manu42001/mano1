import { Component, OnInit } from '@angular/core';
import { SetAllocationService } from '../service/set-allocation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-set-allocation',
  templateUrl: './set-allocation.component.html',
  styleUrls: ['./set-allocation.component.scss']
})
export class SetAllocationComponent implements OnInit {

  id: number;
  rfp_no: number;
  duration: number;
  offshoreMonthlyHours: number = 160;
  offshorePercentage: string = '70%';
  onsiteMonthlyHours: number = 176;
  onsitePercentage: string = '30%';
  showSavedMessage: boolean = false;

  constructor(
    private setAllocationService: SetAllocationService,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.rfp_no = this.apiService.getRfp();
    console.log(this.rfp_no)
  }

  onSubmit() {
    if (this.duration && !/^[0-9]*$/.test(this.duration.toString())) {
      alert('Duration must be a valid integer');
      return;
    }

    const allocationData = {
      Onsite_Monthly_Hours: this.onsiteMonthlyHours,
      Offshore_Monthly_Hours: this.offshoreMonthlyHours,
      Duration: this.duration,
      Onsite_Percentage: this.onsitePercentage,
      Offshore_Percentage: this.offshorePercentage,
      rfp_no: this.rfp_no
    };

    this.setAllocationService.saveAllocationData(allocationData).subscribe(
      response => {
        console.log('Server Response:', response);  // Log the response for debugging
        this.showSavedMessage = true;
        this.snackBar.open('Data saved successfully!', 'Close', {
          duration: 3000,
        });
        setTimeout(() => {
          this.showSavedMessage = false;
        }, 3000);
      },
      error => {
        console.error('Error saving data', error);
        this.snackBar.open(`Error saving data: ${error.message}`, 'Close', {
          duration: 3000,
        });
      }
    );
  }
}
