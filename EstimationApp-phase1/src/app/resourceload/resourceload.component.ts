import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { inlineService } from '../service/inline.service';
import { AllocationService } from '../service/allocation.service';

@Component({
  selector: 'app-resourceload',
  templateUrl: './resourceload.component.html',
  styleUrls: ['./resourceload.component.scss']
})
export class ResourceloadComponent implements OnInit {
  newRow: any = this.getEmptyRow();
  savedRows: any[] = [];
  showEntryRow = false;
  RfpNum: number;
  uniquePhases: string[] = [];
  skillOptions: string[] = [];
  phaseSkillsets: { [key: string]: string[] } = {};
  sequenceNumbers: number[] = [];
  componentsForSequence: string[] = [];

  constructor(
    private apiService: ApiService,
    private inlineService: inlineService,
    private allocationService: AllocationService
  ) {}

  ngOnInit(): void {
    this.RfpNum = this.apiService.getRfp();
    this.fetchSkillsAndPhases();
    this.fetchSequenceNumbers();
  }

  fetchSkillsAndPhases() {
    this.allocationService.fetchSkillsAndPhases(this.RfpNum).subscribe((data: any[]) => {
      this.phaseSkillsets = data.reduce((acc: { [key: string]: string[] }, item: any) => {
        const phase = item.phases || 'Unknown Phase';
        if (!acc[phase]) {
          acc[phase] = [];
        }
        const skillsArray = item.skills.split(',').map((skill: string) => skill.trim());
        acc[phase].push(...skillsArray);
        return acc;
      }, {});

      this.uniquePhases = Object.keys(this.phaseSkillsets);
    });
  }

  fetchSequenceNumbers() {
    this.inlineService.fetchCombine(this.RfpNum).subscribe((response: any[]) => {
      this.sequenceNumbers = [...new Set(response.map(item => parseInt(item.estimation_sequence.S)))];
    });
  }

  onSequenceChange(selectedSequence: number) {
    this.inlineService.fetchCombine(this.RfpNum).subscribe((response: any[]) => {
      this.componentsForSequence = response
        .filter(item => parseInt(item.estimation_sequence.S) === selectedSequence)
        .map(item => item.component.S);

      this.newRow.component = '';
    });
  }

  getEmptyRow() {
    return {
      deliveryLocation: '',
      level: 0,
      sequenceNumber: null as number | null,
      component: '',
      phase: '',
      skills: [] as string[],
      total: 0,
      m1: 0,
      m2: 0,
      m3: 0,
      m4: 0,
      m5: 0,
      m6: 0,
      m7: 0,
      m8: 0,
      m9: 0,
      m10: 0,
      m11: 0,
      m12: 0
    };
  }

  onPhaseChange(selectedPhase: string) {
    this.skillOptions = this.phaseSkillsets[selectedPhase] || [];
    this.newRow.skills = [];
  }

  addRow() {
    this.showEntryRow = true;
    this.newRow = this.getEmptyRow(); // Ensure newRow is reset
  }

  saveRow() {
    if (this.newRow.sequenceNumber && this.newRow.component) {
      console.log('Saving Row:', this.newRow); // Debugging log
      this.savedRows.push({ ...this.newRow, editing: false });
      this.newRow = this.getEmptyRow(); // Reset the newRow object
      this.showEntryRow = false;
    } else {
      console.error('Sequence Number and Component must be selected');
    }
  }

  cancelEntry() {
    this.newRow = this.getEmptyRow();
    this.showEntryRow = false;
  }

  editRow(row: any) {
    row.editing = true;
    row.original = { ...row };
    this.skillOptions = this.phaseSkillsets[row.phase] || [];
    this.onSequenceChange(row.sequenceNumber);
  }

  saveEditedRow(row: any) {
    if (row.sequenceNumber && row.component) {
      row.editing = false;
      delete row.original;
    } else {
      console.error('Sequence Number and Component must be selected');
    }
  }

  cancelEdit(row: any) {
    Object.assign(row, row.original);
    row.editing = false;
    delete row.original;
  }

  removeSavedRow(row: any) {
    this.savedRows = this.savedRows.filter(r => r !== row);
  }

  updateTotal(row: any) {
    row.total = Math.round(
      row.m1 + row.m2 + row.m3 + row.m4 + row.m5 + row.m6 + row.m7 + row.m8 + row.m9 + row.m10 + row.m11 + row.m12
    );
  }
}
