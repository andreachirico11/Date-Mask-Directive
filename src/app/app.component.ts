import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { MaskConfigOptions, Separators } from "./mask-directive/mask-options";
import { FormControl, NgForm } from '@angular/forms';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, AfterViewInit {
  maskConfigOptions: MaskConfigOptions;
  formControl: FormControl;
  startSituation = true;
  public dateModel: string;
  public timeModel: string;
  public dateSeparator: string = null;
  public timeSeparator: string = null;
  public dateTimeSeparator: string = null;
  public separators: string[] = [];
  value = '2019-10-11T23:59:05';
  public dateSelect: string[] = []; 
  public timeSelect: string[] = [];
  
  @ViewChild('configForm') configForm: NgForm;


  ngOnInit() {    
    this.separators = [ ... (Object.keys(Separators).map(key => Separators[key])) ];
    this.formControl = new FormControl(this.value);
    // this.changeMaskOpt(this.dateInputEnum.DATE);
  }

  ngAfterViewInit() {

  }
  
  format() {
    if(this.startSituation === true) {
      this.startSituation = false;
    }
    let date = this.dateSelect.join("");
    if(/i/g.test(date)) {
      date = null;
      console.log(date);
      
    }
    let time = this.timeSelect.join("");
    this.maskConfigOptions = {
      dateConfiguration: date ? date : null,
      timeConfiguration: time ? time : null,
      dateSeparator: this.dateSeparator ? Separators[this.dateSeparator] : null,
      timeSeparator: this.timeSeparator ? Separators[this.timeSeparator] : null,
      dateTimeSeparator: this.dateTimeSeparator ? Separators[this.dateTimeSeparator] : null
    }
  }



  // cercare i casi nulli in date e in time e fare prove
  
  
}



