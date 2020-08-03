import { Component } from "@angular/core";
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Separators, MaskConfigOptions, ArrowBehaviours } from './mask-options';
import { MaskDirective } from './mask.directive';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
@Component({
    template: `    
    <form>
    <input
      [formControl]="formControl"
      type="text"
      dateMask
      [maskOptions]="maskConfigOptions"
    />
  </form>
  `
})

class TestComponent {
    formControl: FormControl;
    maskConfigOptions: MaskConfigOptions;
    constructor() {
        this.formControl = new FormControl('2019-10-10T00:59:00');
        this.maskConfigOptions = {
            dateConfiguration: 'ddMMyy',
            arrowBehaviours: ArrowBehaviours.circular_without_position
        }
    }
}

describe('mask-directive', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let directiveElement;
    let directiveInstance;
    let inputElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                MaskDirective
            ],
            imports: [BrowserModule, FormsModule, ReactiveFormsModule],

        })

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      directiveElement = fixture.debugElement.query(By.directive(MaskDirective));
      directiveInstance = directiveElement.injector.get(MaskDirective)
      inputElement = fixture.debugElement.query(By.css('input'));
      fixture.detectChanges();
    })

    it("should create the component with the directive configured", () => {
      expect(component).toBeDefined();
      expect(directiveInstance["viewModel"]).toBe("dd-MM-yyyy");
      expect(inputElement.nativeElement.value).toBe("10-10-2019");
      expect(directiveInstance["dateTimeSeparator"]).toBe(Separators.space);
    });

    // it("should change value correctly", async(() => {
    //   fixture
    //     .whenStable()
    //     .then(() => {
    //       inputElement.nativeElement.value = "11-10-2019";
    //       inputElement.nativeElement.dispatchEvent(new Event("keypress"));
    //       return fixture.detectChanges();
    //     })
    //     .then(() => {
    //       expect().toBe("11-10-2019");
          
    //     });
    // }));

    it("should detect arrowUp value correctly", async(() => {
      fixture
      .whenStable()
      .then(() => {
        component.maskConfigOptions.arrowBehaviours = ArrowBehaviours.circular_without_position;
          return fixture.detectChanges();
        })
        .then(() => {
          inputElement.nativeElement.value = "11-10-2019";
          inputElement.nativeElement.dispatchEvent(new KeyboardEvent('keydown',{key: 'ArrowUp'} ));
          return fixture.detectChanges();
        })
        .then(() => {
          expect(inputElement.nativeElement.value).toBe("12-10-2019");
        });
    }));


});