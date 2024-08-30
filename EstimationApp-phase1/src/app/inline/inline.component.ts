import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { inlineService } from '../service/inline.service';
import { DataService } from '../service/data.service';
import { SdlcService } from '../service/sdlc.service';

interface SdlcItem {
  lifecycle: {
    N: number;
  };
}

@Component({
  selector: 'app-inline',
  templateUrl: './inline.component.html',
  styleUrls: ['./inline.component.scss'],
})
export class InlineComponent implements OnInit {
  public effortForm: FormGroup;
  editForm: FormGroup;
  @ViewChild('openme') openme: TemplateRef<any> | any;
  showEditPopup = false;
  editData: any = {};
  ComponentsList: any[] = [];
  DataList: any[] = [];
  subComponentsList: any[] = [];
  sizeList: any[][] = [];
  complexityList: any[][] = [];
  uniquePhases: string[] = [];
  availableSizes: string[] = [];
  availableComplexities: string[] = [];
  count = 0;
  selectedComponent: string;
  MetricsList: any[] = [];
  selectedIndex: string;
  hrs: number = 0;
  Types: string[] = ['Function', 'Task'];
  selectedValue: number = 0;
  UnitHrs: number = 0;
  dropdownValues: number[] = Array.from({ length: 11 }, (_, i) => 10 - i);
  UnitValue: number = 0;
  adjustedHrs: number = 0;
  totalEstiHrs: number = 0;
  calList: number[] = [];
  splitValues: number[] = [];
  SdlcList: number[] = [];
  totalHours: any;
  sum: number = 0;
  roundsum: number = 0;
  true: boolean = true;
  rfp_no: number = 0;
  showError: boolean = false;
  data: any;
  List: any[] = [];
  options: any[];
  existingData: any = [];
  total: number = 0;
  matchindexList: any[] = [];
  errorMessage: string = '';
  indexList: any[] = [];
  selectedOption: {
    component: any;
    subComponent: any;
    referenceIndex: any;
  } = { component: null, subComponent: null, referenceIndex: null };
  selectedOptionList: any[] = [];
  matchingIndex: any;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private service: inlineService,
    private apiService: ApiService,
    private dataService: DataService,
    private sdlcService: SdlcService,
    private inlineService: inlineService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.effortForm = this.fb.group({
      tableRows: this.fb.array([], [Validators.required]),
    });
    this.addRow();
  }

  ngOnInit(): void {
    this.rfp_no = this.apiService.getRfp();
    this.get_data();
    this.roundsum = this.total;
    console.log('Initial roundsum:', this.roundsum, this.total);
    this.fetchDataFromBack();
    this.dataService.fetchDictionaryDataByRfp(this.rfp_no).subscribe((data: any[]) => {
      this.MetricsList = data;
      console.log('MetricsList:', this.MetricsList);
      this.uniquePhases = [...new Set(this.MetricsList.map(item => item.phase.S))];
      console.log('Unique Phases:', this.uniquePhases);
    });
    this.sdlcService.fetchsdlc(this.rfp_no).subscribe((data: SdlcItem[]) => {
      this.SdlcList = data.map((item: SdlcItem) => item.lifecycle.N);
      console.log('SdlcList:', this.SdlcList);
    });
    this.fetchSdlcfromBack();
    this.editForm = this.fb.group({
      estimation_sequence: [''],
      component: [''],
      subComponent: [''],
      phase: [''],
      size: [''],
      complexity: [''],
      estimation_type: [''],
      confidenceScale: [''],
      estimation_unit: [''],
      calculated: [''],
      adjusted: [''],
      totalEsti: [''],
      analysis: [''],
      design: [''],
      construction: [''],
      build: [''],
      unitTest: [''],
      referenceIndex: [''], // Added to map combined value
    });
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      estimation_sequence: new FormControl(null, Validators.required),
      component: new FormControl(null, Validators.required),
      subComponent: new FormControl(null, Validators.required),
      phase: new FormControl(null, Validators.required),
      size: new FormControl(null, Validators.required),
      complexity: new FormControl(null, Validators.required),
      confidenceScale: new FormControl(null, Validators.required),
      hours: new FormControl(null, Validators.required),
      estimation_unit: new FormControl(null, Validators.required),
      estimation_type: new FormControl(null, Validators.required),
      calculated: new FormControl(null, Validators.required),
      analysis: new FormControl(null, Validators.required),
      design: new FormControl(null, Validators.required),
      construction: new FormControl(null, Validators.required),
      build: new FormControl(null, Validators.required),
      unitTest: new FormControl(null, Validators.required),
      adjusted: new FormControl(null, Validators.required),
      totalEsti: new FormControl(null, Validators.required),
      referenceIndex: new FormControl(null), // Added to store the combined value
    });
  }

  get getFormControls() {
    const control = this.effortForm.get('tableRows') as FormArray;
    return control;
  }

  addRow() {
    const control = this.effortForm.get('tableRows') as FormArray;
    control.insert(0, this.createFormGroup());

    control.valueChanges.subscribe((rows) => {
      this.sum = this.total;
      for (const row of rows) {
        if (row.totalEsti) {
          console.log('totalEsti:', row.totalEsti);
          this.sum += parseFloat(row.totalEsti);
        }
      }
      this.roundsum = Math.ceil(this.sum);
      console.log('Roundsum:', this.roundsum);
    });

    this.inlineService.fetchrfpdash().subscribe((response: any) => {
      console.log(response);
    });
  }

  removeData(index: number) {
    const control = this.effortForm.get('tableRows') as FormArray;
    control.removeAt(index);
  }

  onSaveForm() {
    console.log('Form Data:', this.effortForm.value);
    const data = this.effortForm.value;
    const control = this.effortForm.get('tableRows') as FormArray;
    const filteredListData = control.value.filter((item: any) => {
      return Object.values(item).some((value) => value !== null);
    });
    const requestBody = filteredListData;
    console.log('Filtered Data:', requestBody);

    this.inlineService.allSubmit(this.rfp_no, requestBody).subscribe(
      (Response) => {
        console.log('Save Response:', Response);
        this.toastr.success('Saved successfully');
      },
      (error) => {
        console.log('Save Error:', error);
      }
    );
    this.apiService.rfpPut(this.roundsum, this.rfp_no).subscribe((Response) => {
      console.log('RFP Put Response:', Response);
    });
  }

  removeEdit() {
    this.dialog.closeAll();
  }

  private fetchDataFromBack() {
    this.dataService.fetchData(this.rfp_no).subscribe((data: any[]) => {
      this.DataList = data;
      console.log('DataList:', this.DataList);
      for (let g of data) {
        console.log('Component:', g.Components.S);
        if (!this.check(g.Components.S)) {
          this.ComponentsList.push(g.Components.S);
          this.List.push(g.Components.S);
          console.log('List:', this.List);
        }
      }
      this.ComponentsList.sort();
      console.log('ComponentsList:', this.ComponentsList);
    });
  }

  check(k: string) {
    return this.ComponentsList.includes(k);
  }

  onSelectSubComponent(item: any, index: number) {
    const newVal = item;
    console.log('Selected Component:', newVal);
    this.subComponentsList[index] = [];
    this.selectedComponent = newVal;
    const control = this.effortForm.get('tableRows') as FormArray;
    control.controls[index].get('component')?.setValue(this.selectedComponent);
    for (let h of this.DataList) {
      if (this.checkSub(h.Components.S)) {
        this.subComponentsList[index].push(h.subComponents.S);
        console.log('Sub Component:', h.subComponents.S);
      }
    }
    this.subComponentsList[index].sort();
    console.log('SubComponentsList:', this.subComponentsList[index]);
    this.count++;
  }

  checkSub(i: string) {
    return i == this.selectedComponent;
  }

  onPhaseChange(event: any, index: number) {
    const phase = event.target.value;
    console.log('Selected Phase:', phase);
    const control = this.effortForm.get('tableRows') as FormArray;
    control.controls[index].get('phase')?.setValue(phase);

    const phaseData = this.MetricsList.filter(item => item.phase.S === phase);
    this.sizeList[index] = [...new Set(phaseData.map(item => item.size.S))];
    console.log('Size List:', this.sizeList[index]);
    this.complexityList[index] = [];
    control.controls[index].get('size')?.reset();
    control.controls[index].get('complexity')?.reset();
  }

  onSizeChange(event: any, index: number) {
    const size = event.target.value;
    console.log('Selected Size:', size);
    const control = this.effortForm.get('tableRows') as FormArray;
    control.controls[index].get('size')?.setValue(size);

    const phase = control.controls[index].get('phase')?.value;
    const sizeData = this.MetricsList.filter(item => item.phase.S === phase && item.size.S === size);
    this.complexityList[index] = [...new Set(sizeData.map(item => item.complexity.S))];
    console.log('Complexity List:', this.complexityList[index]);
    control.controls[index].get('complexity')?.reset();
  }

  onComplexityChange(event: any, index: number) {
    const complexity = event.target.value;
    console.log('Selected Complexity:', complexity);
    const control = this.effortForm.get('tableRows') as FormArray;
    control.controls[index].get('complexity')?.setValue(complexity);

    // Combine Phase, Size, and Complexity into a single variable
    const phase = control.controls[index].get('phase')?.value;
    const size = control.controls[index].get('size')?.value;
    const combinedValue = `${phase}-${size}-${complexity}`;
    console.log('Combined Value:', combinedValue);
    control.controls[index].get('referenceIndex')?.setValue(combinedValue);

    // Fetch hours based on combined value
    const metric = this.MetricsList.find(item => item.phase.S === phase && item.size.S === size && item.complexity.S === complexity);
    if (metric) {
      this.hrs = metric.hours.N;
      control.controls[index].get('hours')?.setValue(this.hrs);
      this.calculateHours(index);
    }
  }

  onSelectIndex(event: any, index: number) {
    const rowFormGroup = this.getFormControls.at(index) as FormGroup;
    const control = this.effortForm.get('tableRows') as FormArray;

    this.selectedOption = {
      component: rowFormGroup.get('component')?.value,
      subComponent: rowFormGroup.get('subComponent')?.value,
      referenceIndex: event,
    };
    console.log('Selected Option:', this.selectedOption);

    const sub = control.get('subComponent')?.value;
    const newVal1 = event;
    this.selectedIndex = newVal1;
    console.log('Selected Index:', newVal1);

    for (let x of this.MetricsList) {
      if (this.checkMet(x.index.S)) {
        this.hrs = x.hours.N;
        control.controls[index].get('hours')?.setValue(this.hrs);
        console.log('Hours:', this.hrs);
        this.calculateHours(index);
      }
    }

    this.MetricsList[this.matchingIndex].isDisabled = false;
  }

  checkMet(y: string) {
    return y === this.selectedIndex;
  }

  onSelectSample(event: any, index: number) {
    this.selectedOptionList.push(this.selectedOption);
    console.log('Selected Option List:', this.selectedOptionList);
    const control = this.effortForm.get('tableRows') as FormArray;
    const conValue = control.controls[index].get('confidenceScale')?.value;
    console.log('Confidence Value:', conValue);
    const unitValue = control.controls[index].get('estimation_unit')?.value;
    console.log('Unit Value:', unitValue);
    this.onSelectCon(conValue, index);
    this.UnitChange(unitValue, index);
    const newVal2 = event.target.value;
    console.log('Estimation Type:', newVal2);
    this.UnitHrs = this.hrs * this.UnitValue;
    control.controls[index].get('calculated')?.setValue(this.UnitHrs);
    console.log('Calculated Hours:', this.UnitHrs);
    let con = {
      scale: this.selectedValue,
      dev: this.UnitHrs,
    };

    const type = control.controls[index].get('estimation_type')?.value;
  }

  onSelectCon(event: any, index: number) {
    const newv = event;
    console.log('Selected Confidence:', newv);
    this.selectedValue = newv;
    const control = this.effortForm.get('tableRows') as FormArray;
    const scale = control.controls[index].get('confidenceScale')?.value;
    console.log('Scale:', scale);
    const dev = control.controls[index].get('calculated')?.value;
    console.log('Dev Hours:', dev);
    const unitValue = control.controls[index].get('estimation_unit')?.value;
    console.log('Unit Value:', unitValue);
    this.UnitChange(unitValue, index);
  }

  UnitChange(event: any, index: number) {
    console.log('Inside Unit Change:', event);

    const newVal2 = event;
    const control = this.effortForm.get('tableRows') as FormArray;
    const dev = control.controls[index].get('calculated')?.value;
    console.log('Dev Hours:', dev);
    this.UnitValue = newVal2;
    this.UnitHrs = this.hrs * this.UnitValue;
    control.controls[index].get('calculated')?.setValue(this.UnitHrs);

    console.log('Unit Hours:', this.UnitHrs);
    let con = {
      scale: this.selectedValue,
      dev: this.UnitHrs,
    };

    const type = control.controls[index].get('estimation_type')?.value;
    if (type === 'Function') {
      this.inlineService.fetchConfidence(con).subscribe((data) => {
        this.adjustedHrs = data;
        console.log('Adjusted Hours:', this.adjustedHrs);
        control.controls[index].get('adjusted')?.setValue(this.adjustedHrs);
        this.totalEstiHrs = Math.round(this.adjustedHrs / (this.SdlcList[2] / 100));
        control.controls[index].get('totalEsti')?.setValue(this.totalEstiHrs);
        console.log('Total Estimation Hours:', this.totalEstiHrs);

        for (let p of this.SdlcList) {
          const cal = (this.totalEstiHrs * p) / 100;
          const calValue = Math.round(cal);
          this.calList.push(calValue);
        }

        this.splitValues = [Math.round((this.UnitHrs * this.SdlcList[1]) / 100)];

        console.log('Calculated List:', this.calList);
        control.controls[index].get('analysis')?.setValue(this.calList[0]);
        control.controls[index].get('design')?.setValue(this.calList[1]);
        control.controls[index].get('construction')?.setValue(this.calList[2]);
        control.controls[index].get('build')?.setValue(this.calList[3]);
        control.controls[index].get('unitTest')?.setValue(this.calList[4]);
        this.calList = [];
      });
    } else if (type === 'Task') {
      this.inlineService.fetchConfidence(con).subscribe((data) => {
        this.adjustedHrs = data;
        console.log('Adjusted Hours:', this.adjustedHrs);
        control.controls[index].get('adjusted')?.setValue(this.adjustedHrs);
        this.totalEstiHrs = this.adjustedHrs;
        control.controls[index].get('totalEsti')?.setValue(this.totalEstiHrs);
      });

      for (let p of this.SdlcList) {
        const cal = 0 * p;
        const calValue = Math.round(cal);
        this.calList.push(calValue);
      }
      console.log('Calculated List:', this.calList);

      control.controls[index].get('analysis')?.setValue(this.calList[0]);
      control.controls[index].get('design')?.setValue(this.calList[1]);
      control.controls[index].get('construction')?.setValue(this.calList[2]);
      control.controls[index].get('build')?.setValue(this.calList[3]);
      control.controls[index].get('unitTest')?.setValue(this.calList[4]);
      this.calList = [];
    }
  }

  calculateHours(index: number) {
    const control = this.effortForm.get('tableRows') as FormArray;
    const conValue = control.controls[index].get('confidenceScale')?.value;
    const unitValue = control.controls[index].get('estimation_unit')?.value;
    this.onSelectCon(conValue, index);
    this.UnitChange(unitValue, index);
  }

  chunkSize = 5;

  getValuesInChunks(array: any[], chunkSize: number): any[][] {
    const result: any[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  @Input() editedItem: any = {};
  isEditOpen = false;
  edit(item: any) {
    this.editedItem = { ...item };
    this.isEditOpen = true;

    console.log('Edit Item:', this.editedItem);
    this.total -= parseInt(this.editedItem.totalEsti.N);
    console.log('Total after edit:', this.total);

    this.openme1();
  }

  private fetchSdlcfromBack() {
    this.sdlcService.fetchsdlc(this.rfp_no).subscribe((data: SdlcItem[]) => {
      this.SdlcList = data.map((item: SdlcItem) => item.lifecycle.N);
      console.log('SdlcList:', this.SdlcList);
    });
  }

  editIndex: number | null = null;
  onEdit(index: number) {
    this.editIndex = index;
  }
  onSave(index: number) {
    const control = this.effortForm.get('tableRows') as FormArray;
    this.editIndex = null;
    const inputField = document.getElementById('editableInput') as HTMLInputElement;
    console.log('Edited value:', inputField.value, 'Index:', index);
    control.controls[index].get('hours')?.setValue(this.hrs);
    control.controls[index].get('estimation_unit')?.setValue(inputField.value);
    this.UnitChange(inputField.value, index);
  }
  isFieldEditable(index: number): boolean {
    return this.editIndex === index;
  }

  removeloaddata(index: number, data: string) {
    console.log('Remove load data:', index, data);
    this.existingData.splice(index, 1);
    this.inlineService.deleteCombine(this.rfp_no, data).subscribe((response: any) => {
      console.log('Delete Response:', response);
    });
  }

  get_data() {
    this.inlineService.fetchCombine(this.rfp_no).subscribe((response: any) => {
      console.log('Fetched Data:', response);
      response.forEach((item: any) => {
        this.selectedOptionList.push({
          component: item.component.S,
          subComponent: item.subComponent.S,
          referenceIndex: item.referenceIndex?.S,
        });
      });
      console.log('Selected Option List:', this.selectedOptionList);
      this.existingData = response;
      this.total = 0;
      for (const i of response) {
        this.total += parseInt(i.totalEsti.N);
        console.log('Total:', this.total);
      }
      this.roundsum = this.total;
      console.log('Roundsum:', this.roundsum);
    });
  }

  fetchData() {
    this.metricService.fetchDictionaryData(this.RfpNum).subscribe((data: any) => {
      this.metricsData = data;
      console.log('Metrics Data:', this.metricsData);
      const referenceIndexArray = this.metricsData.map((item: { phase: { S: any } }) => item.phase.S);
      console.log('Reference Index Array:', referenceIndexArray);
      for (let g of referenceIndexArray) {
        if (!this.check1(g)) {
          this.uniqueHeader.push(g);
        }
      }
      console.log('Unique Header:', this.uniqueHeader);
    });
  }

  check1(k: string) {
    return this.uniqueHeader.includes(k);
  }

  saveEdit1(data: any) {
    console.log('Save Edit Data:', this.items, data);

    this.isEditOpen = false;
    const requestdata = {
      id: data.id.S,
      RfpNum: this.rfp_no,
      referenceIndex: data.referenceIndex.S,
      confidenceScale: data.confidenceScale.S,
      estimation_unit: data.estimation_unit.S,
      estimation_type: data.estimation_type.S,
      calculated: data.calculated.N,
      analysis: data.analysis.N,
      design: data.design.N,
      construction: data.construction.N,
      build: data.build.N,
      unitTest: data.unitTest.N,
      adjusted: data.adjusted.N,
      totalEsti: data.totalEsti.N,
      estimation_sequence: data.estimation_sequence.S,
    };
    console.log('Request Data:', requestdata);
    this.inlineService.saveEdit1(requestdata).subscribe((response: any) => {
      console.log('Save Edit Response:', response);
    });

    this.total += parseInt(data.totalEsti.N);
    console.log('Total after edit save:', this.total);
    this.roundsum = this.total;

    this.apiService.rfpPut(this.roundsum, this.rfp_no).subscribe((Response) => {
      console.log('RFP Put Response:', Response);
    });
    this.dialog.closeAll();
  }

  onselectseq1(index: number, event: any) {
    const seq = event;
    console.log('Selected Sequence:', seq);
    this.editedItem.estimation_sequence.S = seq;
  }
  onselectunit1(index: number) {
    console.log('Unit Change - Hours:', this.editedItem.hours.S, 'Unit:', this.editedItem.estimation_unit.S);

    const calculated = (this.editedItem.hours.S * this.editedItem.estimation_unit.S).toString();
    console.log('Calculated:', calculated);
    this.editedItem.calculated.N = calculated;
    this.onselectcon1(this.editedItem.adjusted.N);

    if (this.editedItem.estimation_type.S === 'Function') {
      for (let p of this.SdlcList) {
        const cal = (this.editedItem.totalEsti.N * p) / 100;
        const calValue = Math.round(cal);
        this.calList.push(calValue);
      }

      console.log('Calculated List:', this.calList);
      let itemList = [
        (this.editedItem.analysis.N = this.calList[0]),
        (this.editedItem.design.N = this.calList[1]),
        (this.editedItem.construction.N = this.calList[2]),
        (this.editedItem.build.N = this.calList[3]),
        (this.editedItem.unitTest.N = this.calList[4]),
      ];
      this.calList = [];
      console.log('Item List:', itemList);
    } else if (this.editedItem.estimation_type.S == 'Task') {
      for (let p of this.SdlcList) {
        const cal = 0 * p;
        const calValue = Math.round(cal);
        this.calList.push(calValue);
      }
      console.log('Calculated List:', this.calList);

      (this.editedItem.analysis.N = this.calList[0]),
        (this.editedItem.design.N = this.calList[1]),
        (this.editedItem.construction.N = this.calList[2]),
        (this.editedItem.build.N = this.calList[3]),
        (this.editedItem.unitTest.N = this.calList[4]);
      this.calList = [];
    }
  }
  onselectcon1(index: number) {
    const dev = this.editedItem.calculated.N;
    const scale = this.editedItem.confidenceScale.S;
    console.log('Confidence Scale:', scale, 'Dev:', dev);
    let con = {
      scale: scale,
      dev: dev,
    };
    this.inlineService.fetchConfidence(con).subscribe((data) => {
      this.editedItem.adjusted.N = data;
      this.editedItem.totalEsti.N = Math.round(this.editedItem.adjusted.N / (this.SdlcList[2] / 100));
      console.log('Adjusted Hours:', this.editedItem.adjusted.N, 'Total Estimation Hours:', this.editedItem.totalEsti.N);

      if (this.editedItem.estimation_type.S === 'Function') {
        for (let p of this.SdlcList) {
          const cal = (this.editedItem.totalEsti.N * p) / 100;
          const calValue = Math.round(cal);
          this.calList.push(calValue);
        }

        console.log('Calculated List:', this.calList);
        let itemList = [
          (this.editedItem.analysis.N = this.calList[0]),
          (this.editedItem.design.N = this.calList[1]),
          (this.editedItem.construction.N = this.calList[2]),
          (this.editedItem.build.N = this.calList[3]),
          (this.editedItem.unitTest.N = this.calList[4]),
        ];
        this.calList = [];
        console.log('Item List:', itemList);
      } else if (this.editedItem.estimation_type.S == 'Task') {
        for (let p of this.SdlcList) {
          const cal = 0 * p;
          const calValue = Math.round(cal);
          this.calList.push(calValue);
        }
        console.log('Calculated List:', this.calList);

        (this.editedItem.analysis.N = this.calList[0]),
          (this.editedItem.design.N = this.calList[1]),
          (this.editedItem.construction.N = this.calList[2]),
          (this.editedItem.build.N = this.calList[3]),
          (this.editedItem.unitTest.N = this.calList[4]);
        this.calList = [];
      }
    });
  }
  onselecttype1(index: number) {
    if (this.editedItem.estimation_type.S === 'Function') {
      for (let p of this.SdlcList) {
        const cal = (this.editedItem.totalEsti.N * p) / 100;
        const calValue = Math.round(cal);
        this.calList.push(calValue);
      }

      console.log('Calculated List:', this.calList);
      let itemList = [
        (this.editedItem.analysis.N = this.calList[0]),
        (this.editedItem.design.N = this.calList[1]),
        (this.editedItem.construction.N = this.calList[2]),
        (this.editedItem.build.N = this.calList[3]),
        (this.editedItem.unitTest.N = this.calList[4]),
      ];
      this.calList = [];
      console.log('Item List:', itemList);
    } else if (this.editedItem.estimation_type.S == 'Task') {
      for (let p of this.SdlcList) {
        const cal = 0 * p;
        const calValue = Math.round(cal);
        this.calList.push(calValue);
      }
      console.log('Calculated List:', this.calList);

      (this.editedItem.analysis.N = this.calList[0]),
        (this.editedItem.design.N = this.calList[1]),
        (this.editedItem.construction.N = this.calList[2]),
        (this.editedItem.build.N = this.calList[3]),
        (this.editedItem.unitTest.N = this.calList[4]);
      this.calList = [];
    }
  }
  [x: string]: any;
  items: any[];

  estimation_unit: string;
  dev: number;

  id: string;

  openme1(): void {
    console.log('Opening Edit Dialog');
    this.dialog.open(
      this.openme,
      {
        data: {},
        width: '1000px',
        height: '300px',
        disableClose: false,
      }
    );
  }

  onPhaseChangeEdit(event: any) {
    const phase = event.target.value;
    console.log('Edit - Selected Phase:', phase);
    const phaseData = this.MetricsList.filter(item => item.phase.S === phase);
    this.availableSizes = [...new Set(phaseData.map(item => item.size.S))];
    this.availableComplexities = [];
    this.editedItem.size.S = null;
    this.editedItem.complexity.S = null;
    console.log('Available Sizes:', this.availableSizes);
  }

  onSizeChangeEdit(event: any) {
    const size = event.target.value;
    console.log('Edit - Selected Size:', size);
    const phase = this.editedItem.phase.S;
    const sizeData = this.MetricsList.filter(item => item.phase.S === phase && item.size.S === size);
    this.availableComplexities = [...new Set(sizeData.map(item => item.complexity.S))];
    this.editedItem.complexity.S = null;
    console.log('Available Complexities:', this.availableComplexities);
  }
}
