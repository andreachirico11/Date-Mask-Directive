import {
  Component,
  OnInit,
} from "@angular/core";
import { MaskConfigOptions, Separators, ArrowBehaviours } from "./mask-directive/mask-options";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  maskConfigOptions: MaskConfigOptions;
  formControl: FormControl;
  usingTheDirective = false;
  public dateModel: string;
  public timeModel: string;
  public dateSeparator: Separators = null;
  public timeSeparator: Separators = null;
  public dateTimeSeparator: Separators = null;
  public separators: string[] = [];
  public arrowBehaviours: string[] = [];
  public arrowBehaviour: string = null;
  defaultValue = "2019-10-11T23:59:05";
  public dateSelect: string[] = [];
  public timeSelect: string[] = [];
  public regExp = new RegExp('_', 'g');
  public noInitialValue = false;


  ngOnInit() {
    this.separators = [
      ...Object.keys(Separators).map((key) => Separators[key]),
    ];
    this.arrowBehaviours = [
      ...Object.keys(ArrowBehaviours).map((key) => ArrowBehaviours[key])
        .filter(b => b.length > 1),
    ];
    this.formControl = new FormControl(this.defaultValue);   
  }
  
  
  format(): void {   
    this.usingTheDirective = false;
    this.maskConfigOptions = {};
    const date = this.createDate();
    if (date) {
      this.maskConfigOptions.dateConfiguration = date;
    }
    const time = this.createTime();
    if (time) {
      this.maskConfigOptions.timeConfiguration = time;
    }
    if(!date && time) {
      this.formControl = new FormControl(this.defaultValue.substring(11));
    } else {
      this.formControl = new FormControl(this.defaultValue);
    }
    if(this.noInitialValue === true) {
      this.formControl = new FormControl(null);
      this.maskConfigOptions.ifNoEntryUseActualDate = true;
    }
    if (this.dateSeparator) {
      this.maskConfigOptions.dateSeparator = this.dateSeparator;
    }
    if (this.timeSeparator) {
      this.maskConfigOptions.timeSeparator = this.timeSeparator;
    }
    if (this.dateTimeSeparator) {
      this.maskConfigOptions.dateTimeSeparator = this.dateTimeSeparator;
    }
    if(this.arrowBehaviour) {
      this.maskConfigOptions.arrowBehaviours = ArrowBehaviours[this.arrowBehaviour];
    }
    console.log('Mask Configuration: ', this.maskConfigOptions);    
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
