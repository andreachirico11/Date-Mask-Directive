import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { MaskConfigOptions, Separators } from "./mask-directive/mask-options";
import { FormControl, NgForm } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, AfterViewInit {
  maskConfigOptions: MaskConfigOptions;
  formControl: FormControl;
  usingTheDirective = false;
  public dateModel: string;
  public timeModel: string;
  public dateSeparator: string = null;
  public timeSeparator: string = null;
  public dateTimeSeparator: string = null;
  public separators: string[] = [];
  defaultValue = "2019-10-11T23:59:05";
  public dateSelect: string[] = [];
  public timeSelect: string[] = [];
  public circularArrows: boolean = true;


  ngOnInit() {
    this.separators = [
      ...Object.keys(Separators).map((key) => Separators[key]),
    ];
    this.formControl = new FormControl(this.defaultValue);
  }
  
  ngAfterViewInit() {}
  
  format(): void {
    this.usingTheDirective = false;
    this.maskConfigOptions = {};
    this.formControl = new FormControl(this.defaultValue);
    // this.formControl.setValue(this.defaultValue)
    const date = this.createDate();
    if (date) {
      this.maskConfigOptions.dateConfiguration = date;
    }
    const time = this.createTime();
    if (time) {
      this.maskConfigOptions.timeConfiguration = time;
    }
    if (this.dateSeparator) {
      this.maskConfigOptions.dateSeparator = Separators[this.dateSeparator];
    }
    if (this.timeSeparator) {
      this.maskConfigOptions.timeSeparator = Separators[this.timeSeparator];
    }
    if (this.dateTimeSeparator) {
      this.maskConfigOptions.dateTimeSeparator =
        Separators[this.dateTimeSeparator];
    }
    //////////////////////////////
    this.maskConfigOptions.circularArrowBehaviour = this.circularArrows;
    /////////////////////////////////
    console.log(this.maskConfigOptions);
    setTimeout(() => {
      this.usingTheDirective = true;
    }, 100);
  }

  createDate(): string {
    if (this.dateSelect.length < 3) {
      return null;
    }
    if(this.dateSelect.findIndex((sigle) => sigle === "xx")!== -1) {
      return null;
    }
    return this.findMoreOccurenciesForAllElementInArray([...this.dateSelect])
      ? null
      : this.dateSelect.join("");
  }

  createTime(): string {
    const filteredTime = this.timeSelect.filter((sigle) => sigle !== "xx");
    if(filteredTime.length < 2) {
      return null;
    }
    return this.findMoreOccurenciesForAllElementInArray([...filteredTime])
      ? null
      : filteredTime.join("");
  }

  findMoreOccurenciesForAllElementInArray(arr: string[]) {
    for (let i = 0; i < arr.length; i++) {
      if (this.findIfElementOccurMoreTimeInArray([...arr], arr[i])) {
        return true;
      }
    }
    return false;
  }

  findIfElementOccurMoreTimeInArray(arr: string[], element: string): boolean {
    let i = 0;
    const indexes = [];
    while (i !== -1) {
      i = arr.indexOf(element, i);
      if (i !== -1) {
        indexes.push(i);
        i++;
      }
    }
    return indexes.length > 1 ? true : false;
  }

  defaultDateFormat() {
      this.dateSelect = ['dd', 'MM', 'yy'];
      this.timeSelect = [];
      this.format();
    }
    
    defaultTimeFormat() {
      this.dateSelect = [];
      this.timeSelect = ['hh', 'mm', 'ss'];
      this.format();
    }
    
    defaultDateTimeFormat() {
      this.dateSelect = ['dd', 'MM', 'yy'];
      this.timeSelect = ['hh', 'mm', 'ss'];
      this.format();
  }

}
