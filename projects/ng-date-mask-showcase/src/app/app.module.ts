import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgDateMaskModule } from "ng-date-mask";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, NgDateMaskModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
