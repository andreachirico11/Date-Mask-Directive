import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MaskConfigOptions, Separators } from "./mask-directive/mask-options";
import { FormControl } from '@angular/forms';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  maskConfigOptions: MaskConfigOptions;
  formControl: FormControl;
  value = '2019-10-10T00:59:00';
  get dateInputEnum() {
    return DateInputEnum;
  }


  ngOnInit() {
    this.formControl = new FormControl(this.value);
    this.changeMaskOpt(this.dateInputEnum.DATE);
  }

  changeMaskOpt(typeOFInput: DateInputEnum) {
    switch (typeOFInput) {
      case DateInputEnum.DATE:
        // this.maskConfigOptions = {};
        this.maskConfigOptions = {
          dateConfiguration: "yyMMdd",
          dateSeparator: Separators.space,
        };
        break;
      case DateInputEnum.DATE_TIME:
        // this.maskConfigOptions = {};
        this.maskConfigOptions = {
          dateConfiguration: "yyMMdd",
          timeConfiguration: "hhmmss",
          dateSeparator: Separators.dot,
          timeSeparator: Separators.dot,
          dateTimeSeparator: Separators.dot,
          minYear: 1900,
          maxYear: 2500,
        };
        break;
      case DateInputEnum.TIME:
        // this.maskConfigOptions = {};
        this.maskConfigOptions = {
          timeConfiguration: "sshhmm",
          timeSeparator: Separators.dot,
        };
        break;
      default:
        break;
    }
    this.ngOnInit()
  }
  
}



enum DateInputEnum {
  DATE_TIME = "DATE_TIME",
  DATE = "DATE",
  TIME = "TIME",
}