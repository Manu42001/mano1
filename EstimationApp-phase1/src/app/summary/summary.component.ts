import { Component, OnInit } from '@angular/core';
import { PivotService } from '../service/pivot.service';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { ApiService } from '../service/api.service';

interface DataRow {
  [key: string]: number | 0;
}

interface DataTable {
  estimation_sequence: string;
  label: string;
  values: DataRow;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  data: DataTable[] = [];
  filteredData: { [key: string]: DataTable[] } = {};
  filteredSequences: string[] = [];
  tribes: string[] = ['Delivery'];
  products: string[] = ['TGM'];
  rowLabels: string[] = [];
  columnLabels: string[] = [];
  selectedTribes: string[] = ['Delivery'];
  selectedProducts: string[] = ['TGM'];
  selectedRowLabels: string[] = [];
  selectedColumnLabels: string[] = [];
  columnTotals: { [key: string]: number } = {};
  rowTotals: { [key: string]: number } = {};
  // data1: number;
  private clickTimeout: any;
  rfp_no: number;
  //route: any;

  constructor(private pivotService: PivotService, private route: ActivatedRoute, private apiService:ApiService) {} // Initialize route

  ngOnInit(): void {
    this.rfp_no = this.apiService.getRfp();
  console.log(this.rfp_no)
  //const data = 79; // RFP number only 1
  this.fetchPivot(this.rfp_no);
  }
  selectTribes() {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      this.selectedTribes = [];
    } else {
      this.clickTimeout = setTimeout(() => {
        this.selectedTribes = [...this.tribes];
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
      }, 300);
    }
  }

  selectProducts() {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      this.selectedProducts = [];
    } else {
      this.clickTimeout = setTimeout(() => {
        this.selectedProducts = [...this.products];
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
      }, 300);
    }
  }

  selectAllColumns(event: MouseEvent) {
    event.preventDefault();
    if (this.selectedColumnLabels.length === this.columnLabels.length) {
      this.selectedColumnLabels = [];
    } else {
      this.selectedColumnLabels = [...this.columnLabels];
    }
    this.filterData();
  }

  selectAllRows(event: MouseEvent) {
    event.preventDefault();
    if (this.selectedRowLabels.length === this.rowLabels.length) {
      this.selectedRowLabels = [];
    } else {
      this.selectedRowLabels = [...this.rowLabels];
    }
    this.filterData();
  }

  filterData() {
    const filteredData: { [key: string]: DataTable[] } = {};
    this.filteredSequences = [];

    this.data.forEach(item => {
      const rowMatch = this.selectedRowLabels.length === 0 || this.selectedRowLabels.includes(item.estimation_sequence);
      const columnMatch = this.selectedColumnLabels.length === 0 || this.selectedColumnLabels.some(label => item.values[label] !== undefined);

      if (rowMatch && columnMatch) {
        if (!filteredData[item.estimation_sequence]) {
          filteredData[item.estimation_sequence] = [];
          this.filteredSequences.push(item.estimation_sequence);
        }
        filteredData[item.estimation_sequence].push(item);
      }
    });

    this.filteredData = filteredData;
    this.sortDataBySequence();
  }

  sortDataBySequence() {
    this.filteredSequences.sort((a, b) => a.localeCompare(b));
  }

  resetFilters() {
    this.selectedRowLabels = [];
    this.selectedColumnLabels = [];
    this.filterData();
  }

  fetchPivot(data: any): void {
    this.pivotService.fetchPivot(data).subscribe(
      (response: any) => {
        this.data = this.transformData(response.totals);
        this.extractColumnLabels();
        this.extractRowLabels();
        this.calculateInitialTotals();
        this.filterData();
        console.log('Data from backend:', this.data);
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  transformData(totals: any): DataTable[] {
    const sequences = Object.keys(totals);
    let transformedData: DataTable[] = [];

    sequences.forEach(sequence => {
      const items = totals[sequence];
      Object.keys(items).forEach(label => {
        transformedData.push({
          estimation_sequence: sequence,
          label: label,
          values: items[label]
        });
      });
    });

    return transformedData;
  }

  extractColumnLabels() {
    this.columnLabels = [];
    this.data.forEach(item => {
      Object.keys(item.values).forEach(label => {
        if (!this.columnLabels.includes(label)) {
          this.columnLabels.push(label);
        }
      });
    });
  }

  extractRowLabels() {
    this.rowLabels = [];
    this.data.forEach(item => {
      if (!this.rowLabels.includes(item.estimation_sequence)) {
        this.rowLabels.push(item.estimation_sequence);
      }
    });
  }

  calculateInitialTotals() {
    this.columnTotals = {};
    this.rowTotals = {};

    this.data.forEach(item => {
      Object.keys(item.values).forEach(key => {
        if (!this.columnTotals[key]) {
          this.columnTotals[key] = 0;
        }
        this.columnTotals[key] += item.values[key] || 0;
      });

      if (!this.rowTotals[item.estimation_sequence]) {
        this.rowTotals[item.estimation_sequence] = 0;
      }
      this.rowTotals[item.estimation_sequence] += this.calculateRowTotal(item.values);
    });
  }

  toggleColumnSelection(columnLabel: string) {
    if (this.selectedColumnLabels.includes(columnLabel)) {
      this.selectedColumnLabels = this.selectedColumnLabels.filter(label => label !== columnLabel);
    } else {
      this.selectedColumnLabels.push(columnLabel);
    }
    this.filterData();
  }

  toggleRowSelection(rowLabel: string) {
    if (this.selectedRowLabels.includes(rowLabel)) {
      this.selectedRowLabels = this.selectedRowLabels.filter(label => label !== rowLabel);
    } else {
      this.selectedRowLabels.push(rowLabel);
    }
    this.filterData();
  }

  calculateRowTotal(row: DataRow): number {
    return Object.values(row).reduce((sum, value) => sum! + (value || 0), 0);
  }

  calculateColumnTotal(columnLabel: string): number {
    return this.filteredSequences.reduce((sum, sequence) => {
      return sum + this.filteredData[sequence].reduce((sequenceSum, row) => {
        return sequenceSum + (row.values[columnLabel] || 0);
      }, 0);
    }, 0);
  }

  calculateGrandTotal(): number {
    return this.filteredSequences.reduce((sum, sequence) => {
      return sum + this.filteredData[sequence].reduce((sequenceSum, row) => {
        return sequenceSum + this.calculateRowTotal(row.values);
      }, 0);
    }, 0);
  }

  calculateGroupTotal(sequence: string): number {
    return this.filteredData[sequence].reduce((sum, row) => {
      return sum + this.calculateRowTotal(row.values);
    }, 0);
  }

  calculateGroupColumnTotal(sequence: string, columnLabel: string): number {
    return this.filteredData[sequence].reduce((sum, row) => {
      return sum + (row.values[columnLabel] || 0);
    }, 0);
  }
}