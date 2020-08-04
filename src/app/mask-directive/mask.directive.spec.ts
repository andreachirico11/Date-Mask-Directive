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
    let directiveInstance: MaskDirective;
    let nativeInputElement: HTMLInputElement;

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
      directiveInstance = directiveElement.injector.get(MaskDirective);
      nativeInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      fixture.detectChanges();
    })

    it("should create the component with the directive configured", () => {
      expect(component).toBeDefined();
      expect(directiveInstance["viewModel"]).toBe("dd-MM-yyyy");
      expect(nativeInputElement.value).toBe("10-10-2019");
      expect(directiveInstance["dateTimeSeparator"]).toBe(Separators.space);
    });

    it("should change value correctly", async(() => {
      fixture
        .whenStable()
        .then(() => {
          nativeInputElement.value = "11-10-2019";
          nativeInputElement.setSelectionRange(1,1);
          nativeInputElement.dispatchEvent(new KeyboardEvent('keydown', {key: '1'}));
          return fixture.detectChanges();
        })
        .then(() => {
          expect(nativeInputElement.value).toBe("01-10-2019");
        })
        .then(() => {
          nativeInputElement.setSelectionRange(4,4);
          nativeInputElement.dispatchEvent(new KeyboardEvent('keydown', {key: '3'}));
          return fixture.detectChanges();
        })
        .then(() => {
          expect(nativeInputElement.value).toBe("01-03-2019");
        })
        .then(() => {
          nativeInputElement.setSelectionRange(7,7);
          nativeInputElement.dispatchEvent(new KeyboardEvent('keydown', {key: '1'}));
          return fixture.detectChanges();
        })
        .then(() => {
          expect(nativeInputElement.value).toBe("01-03-0001");
        });
    }));

    it("should detect arrowUp value correctly", async(() => {
      fixture
      .whenStable()
      .then(() => {
        component.maskConfigOptions.arrowBehaviours = ArrowBehaviours.circular_without_position;
          return fixture.detectChanges();
        })
        .then(() => {
          nativeInputElement.value = "11-10-2019";
          nativeInputElement.dispatchEvent(new KeyboardEvent('keydown',{key: 'ArrowUp'} ));
          return fixture.detectChanges();
        })
        .then(() => {
          expect(nativeInputElement.value).toBe("12-10-2019");
        });
    }));

    it("should render correctly", async(() => {
      fixture
      .whenStable()
      .then(() => {
        component.formControl.setValue("23:59:01");
        component.maskConfigOptions = {
          timeConfiguration: 'mmhh',
          timeSeparator: Separators.dot
        }        
        return fixture.detectChanges();
      })
      .then(() => {
        directiveInstance.ngOnInit();
        return fixture.detectChanges();        
      })
      .then(() => {
        expect(nativeInputElement.value).toBe("59.23");
      })
      .then(() => {
        component.formControl = new FormControl('2019-11-10T23:59:03');
        component.maskConfigOptions = {
          timeConfiguration: 'mmhh',
          timeSeparator: Separators.dot,
          dateSeparator: Separators.slash,
          dateTimeSeparator: Separators.dash,
          dateConfiguration: 'MMyydd'
        }        
        return fixture.detectChanges();
      })
      .then(() => {
        directiveInstance.ngOnInit();
        return fixture.detectChanges();        
      })
      .then(() => {
        expect(nativeInputElement.value).toBe("11/2019/10-59.23");
      })
      .then(() => {
        component.formControl = new FormControl('2019-11-10T23:59:03');
        component.maskConfigOptions = {
          dateConfiguration: 'MMddyy',
          dateSeparator: Separators.space
        }        
        return fixture.detectChanges();
      })
      .then(() => {
        directiveInstance.ngOnInit();
        return fixture.detectChanges();        
      })
      .then(() => {
        expect(nativeInputElement.value).toBe("11 10 2019");
      })
    }));

    it("should delete correctly", async(() => {
      fixture
      .whenStable()
      .then(() => {
        component.formControl = new FormControl('2019-11-10T23:59:03');
        component.maskConfigOptions = {
          timeConfiguration: 'mmhh',
          dateConfiguration: 'MMddyy'          
        }        
        return fixture.detectChanges();
      })
      .then(() => {
        directiveInstance.ngOnInit();
        return fixture.detectChanges();        
        // 11-10-2019 59:23
        })
      .then(() => {
        nativeInputElement.setSelectionRange(7,7);
        nativeInputElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Delete'}));
        return fixture.detectChanges();
      })
      .then(() => {
        expect(nativeInputElement.value).toBe("11-10-yyyy 59:23");
      })
      .then(() => {
        nativeInputElement.setSelectionRange(14,14);
        nativeInputElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Delete'}));
        return fixture.detectChanges();
      })
      .then(() => {
        expect(nativeInputElement.value).toBe("11-10-yyyy 59:hh");
      })
    }))

    it("getNextOrPrevDatatype test", () => {
      expect(directiveInstance.getNextOrPrevDatatype(dateTypes.DAYS)).toBe(dateTypes.MONTHS);
      expect(directiveInstance.getNextOrPrevDatatype(dateTypes.DAYS, true)).toBeUndefined();      
    });

    it("handleCursor test", () => {
      component.formControl = new FormControl("2019-11-10T23:59:03");
      component.maskConfigOptions = {
        timeConfiguration: "mmhh",
        dateConfiguration: "MMddyy",
      };
      fixture.detectChanges();
      directiveInstance.ngOnInit();
      fixture.detectChanges();   
      expect(nativeInputElement.selectionStart).toBe(1);
      directiveInstance.handleCursor(dateTypes.YEARS);
      expect(nativeInputElement.selectionStart).toBe(9);
      directiveInstance.handleCursor(dateTypes.HOURS);
      expect(nativeInputElement.selectionStart).toBe(15);      
    });

    it("quantifyMonthNumberOfdays test", () => {
      expect(directiveInstance.quantifyMonthNumbOfDays(4, 2020)).toBe(30);
      expect(directiveInstance.quantifyMonthNumbOfDays(2, 2020)).toBe(29);
      expect(directiveInstance.quantifyMonthNumbOfDays(2, 2019)).toBe(28);
    })

    it("monthOrDayValidator test", () => {
      component.formControl = new FormControl("2019-02-29");
      fixture.detectChanges();
      directiveInstance.ngOnInit();
      fixture.detectChanges();   
      expect(directiveInstance.monthOrDayValidator()).toBeFalse();
      component.formControl = new FormControl("2020-02-29");
      fixture.detectChanges();
      directiveInstance.ngOnInit();
      fixture.detectChanges();   
      expect(directiveInstance.monthOrDayValidator()).toBeTrue();
    })
    //////////////////////////
});

enum dateTypes {
  'DAYS',
  'MONTHS',
  'YEARS',
  'HOURS',
  'MINUTES',
  'SECONDS'
};