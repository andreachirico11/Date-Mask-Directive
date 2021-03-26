import {
    Directive,
    Input,
    ElementRef,
    OnInit,
    HostListener,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MaskConfigOptions, Separators, ArrowBehaviours } from './mask-options';

@Directive({
    selector: '[dateMask]',
})
export class MaskDirective implements OnInit {
    @Input('maskOptions') maskOptions: MaskConfigOptions;
    inputElement: HTMLInputElement;
    viewModel: string = ''; // model of the input es dd-MM-yyyy hh:mm
    splittedViewModel: string[]; // splitted version of the model to use set and get
    dateSeparator;
    dateTimeSeparator;
    timeSeparator;
    maxYear: number;
    minYear: number;
    arrowBehaviours: ArrowBehaviours;
    dateOnlyMode: boolean;
    ifNoEntryUseActualDate: boolean;
    firstAction: boolean;

    get splittedHtmlValueBeforeFormat(): string[] {
        //"2019-05-22T03:24:07", HOW INPUT IS FORMATTED
        let valueToSplit = this.inputElement.value.replace(/T/g, this.dateTimeSeparator).replace(/-/g, this.dateSeparator).replace(/:/g, this.timeSeparator);
        const output = valueToSplit.split(this.dateTimeSeparator).join(',').split(this.timeSeparator).join(',').split(this.dateSeparator).join(',').split(',');
        return output;
    }
    get day(): string {
        return this.splittedHtmlValueBeforeFormat[
            this.splittedViewModel.findIndex((value) => value === 'dd')
        ];
    }
    set day(newDay) {
        const newInput = this.splittedHtmlValueBeforeFormat;
        newInput[this.splittedViewModel.findIndex((value) => value === 'dd')] = newDay;
        this.updateFormControlValue(newInput);
    }
    get month(): string {
        return this.splittedHtmlValueBeforeFormat[
            this.splittedViewModel.findIndex((value) => value === 'MM')
        ];
    }
    set month(newMonth) {
        const newInput = this.splittedHtmlValueBeforeFormat;
        newInput[
            this.splittedViewModel.findIndex((value) => value === 'MM')
        ] = newMonth;
        this.updateFormControlValue(newInput);
    }
    get year(): string {
        return this.splittedHtmlValueBeforeFormat[
            this.splittedViewModel.findIndex((value) => value === 'yyyy')
        ];
    }
    set year(newYear) {
        const newInput = this.splittedHtmlValueBeforeFormat;
        newInput[
            this.splittedViewModel.findIndex((value) => value === 'yyyy')
        ] = newYear;
        this.updateFormControlValue(newInput);
    }
    get hour(): string {
        return this.splittedHtmlValueBeforeFormat[this.splittedViewModel.findIndex(value => value === 'hh')];
    }
    set hour(newHour) {
        const newInput = this.splittedHtmlValueBeforeFormat;
        newInput[
            this.splittedViewModel.findIndex((value) => value === 'hh')
        ] = newHour;
        this.updateFormControlValue(newInput);
    }
    get minute(): string {
        return this.splittedHtmlValueBeforeFormat[this.splittedViewModel.findIndex(value => value === 'mm')];
    }
    set minute(newMinute) {
        const newInput = this.splittedHtmlValueBeforeFormat;
        newInput[
            this.splittedViewModel.findIndex((value) => value === 'mm')
        ] = newMinute;
        this.updateFormControlValue(newInput);
    }
    get second(): string {
        const areSecondsInVModel = this.splittedViewModel.findIndex((value) => value === 'ss');
        return areSecondsInVModel === -1 ?
            '00' :
            this.splittedHtmlValueBeforeFormat[this.splittedViewModel.findIndex(value => value === 'ss')];
    }
    set second(newSecond) {
        const newInput = this.splittedHtmlValueBeforeFormat;
        const areSecondsInVModel = this.splittedViewModel.findIndex((value) => value === 'ss');
        if (areSecondsInVModel === -1) {
            newInput.push(newSecond);
        } else {
            newInput[areSecondsInVModel] = newSecond;
        }
        this.updateFormControlValue(newInput);
    }

    // ##############################################################################################

    constructor(private ngControl: NgControl, private elRef: ElementRef) {
        this.inputElement = elRef.nativeElement;
    }

    ngOnInit(): void {
        this.configSeparators();
        this.buildViewModel();
        this.buildSplittedViewModel();
        this.formatInputValueBasedOnViewModel();
        this.moveCursorToStartPosition();
        this.firstAction = true;
    }


    updateFormControlValue(newInput: string[]): void {
        if (!this.second && this.second !== '00') {
            this.second = '00';
        }
        const length = this.viewModel.length;
        switch (length) {
            case 10: // date
                this.inputElement.value = newInput.join(this.dateSeparator);
                this.ngControl.control.setValue(this.year + '-' + this.month + '-' + this.day);
                break;
            case 5:// time without seconds
                this.inputElement.value = newInput.join(this.timeSeparator);
                this.ngControl.control.setValue(this.hour + ':' + this.minute + ':' + this.second);
                break;
            case 8:// time with seconds
                this.inputElement.value = newInput.join(this.timeSeparator);
                this.ngControl.control.setValue(this.hour + ':' + this.minute + ':' + this.second);
                break;
            default: // complete date
                const date = newInput.slice(0, 3).join(this.dateSeparator);
                const time = newInput.slice(3, 6).join(this.timeSeparator);
                this.inputElement.value = date + this.dateTimeSeparator + time;
                this.ngControl.control.setValue(this.year + '-' + this.month + '-' + this.day + 'T' + this.hour + ':' + this.minute + ':' + this.second);
                break;
        }
        this.formatInputValueBasedOnViewModel();
    }


    buildViewModel(): void {
        let newViewModel = 'yyyy-MM-dd hh:mm:ss';
        if (this.maskOptions.dateConfiguration) {
            const splittedDateModel = this.maskOptions.dateConfiguration.split('');
            let dateModel = [];
            for (let i = 0, temp = ''; i < 6; i++) {
                if (i % 2 === 0 || i === 0) {
                    temp = splittedDateModel[i] === 'y' ? 'yy' : splittedDateModel[i];
                } else {
                    temp = temp + (splittedDateModel[i] === 'y' ? 'yy' : splittedDateModel[i]);
                    dateModel.push(temp);
                    temp = '';
                }
            }
            newViewModel = dateModel.join(this.dateSeparator);
        }
        if (this.maskOptions.dateConfiguration && this.maskOptions.timeConfiguration) {
            newViewModel = newViewModel + this.dateTimeSeparator;
        }
        if (this.maskOptions.timeConfiguration) {
            const splittedTimeModel = this.maskOptions.timeConfiguration.split('');
            let timeModel = [];
            for (let i = 0, temp = ''; i < splittedTimeModel.length; i++) {
                if (i % 2 === 0 || i === 0) {
                    temp = splittedTimeModel[i];
                } else {
                    temp = temp + splittedTimeModel[i];
                    timeModel.push(temp);
                }
            }
            newViewModel = newViewModel + (timeModel.join(this.timeSeparator));
        }
        this.viewModel = newViewModel;
    }

    configSeparators(): void {
        this.dateSeparator = this.maskOptions.dateSeparator ? this.maskOptions.dateSeparator : Separators.dash;
        this.dateTimeSeparator = this.maskOptions.dateTimeSeparator ? this.maskOptions.dateTimeSeparator : Separators.space;
        this.timeSeparator = this.maskOptions.timeSeparator ? this.maskOptions.timeSeparator : Separators.colon;
        this.maxYear = this.maskOptions.maxYear ? this.maskOptions.maxYear : 2050;
        this.minYear = this.maskOptions.minYear ? this.maskOptions.minYear : 1970;
        this.arrowBehaviours = this.maskOptions.arrowBehaviours || this.maskOptions.arrowBehaviours === 0
            ? this.maskOptions.arrowBehaviours : ArrowBehaviours.limited_with_control;
        this.ifNoEntryUseActualDate = this.maskOptions.ifNoEntryUseActualDate || null;

    }


    buildSplittedViewModel(): void {
        const length = this.viewModel.length;
        let regexSeparator = '';
        switch (length) {
            case 10: // date
                regexSeparator = this.dateSeparator;
                this.dateOnlyMode = false;
                break;
            case 5: case 8:// time with or without seconds
                regexSeparator = this.timeSeparator;
                this.dateOnlyMode = true;
                break;
            default: // complete date
                this.dateOnlyMode = false;
                regexSeparator = this.timeSeparator + '\\' + this.dateSeparator + '\\' + this.dateTimeSeparator;
                break;
        }
        const reg = new RegExp('[' + regexSeparator + ']');
        this.splittedViewModel = this.viewModel.split(reg);
    }


    formatInputValueBasedOnViewModel(): void {
        let year, month, day, hour, minute, second;
        year = month = day = hour = minute = second = null;
        if (this.splittedHtmlValueBeforeFormat.length > 1) {
            if (this.dateOnlyMode) {
                [hour, minute, second] = this.splittedHtmlValueBeforeFormat;
            } else {
                [year, month, day, hour, minute, second] = this.splittedHtmlValueBeforeFormat;
            }
        }
        let newInputValue = '';
        for (let position of this.splittedViewModel) {
            switch (position) {
                case 'dd':
                    newInputValue = newInputValue + (day ? day : 'dd') + this.dateSeparator;
                    break;
                case 'MM':
                    newInputValue = newInputValue + (month ? month : 'MM') + this.dateSeparator;
                    break;
                case 'yyyy':
                    newInputValue = newInputValue + (year ? year : 'yyyy') + this.dateSeparator;
                    break;
                case 'hh':
                    newInputValue = newInputValue + (hour ? hour : 'hh') + this.timeSeparator;
                    break;
                case 'mm':
                    newInputValue = newInputValue + (minute ? minute : 'mm') + this.timeSeparator;
                    break;
                case 'ss':
                    newInputValue = newInputValue + (second ? second : 'ss') + this.timeSeparator;
                    break;
                default:
                    break;
            };
        }
        if (this.splittedViewModel.length >= 5) {
            let counter = 0;
            newInputValue = newInputValue.replace(new RegExp('[' + this.dateSeparator + ']', 'g'), () => {
                counter++;
                return counter === 3 ? this.dateTimeSeparator : this.dateSeparator;
            });
        }
        newInputValue = newInputValue.substring(0, newInputValue.length - 1);
        this.inputElement.value = newInputValue;
    }



    @HostListener('keydown', ['$event']) handleKeydown(event): boolean {
        const key = event.key;
        const cursorStartingPosition = this.inputElement.selectionStart,
            actualPosition = this.determinePositionBasedOnModel(
                cursorStartingPosition
            );


        if (key === 'Tab' || key === 'Enter') {
            return true
        }
        event.preventDefault();
        if (this.isDateNull() && this.firstAction && this.ifNoEntryUseActualDate) {
            this.replaceWithActualDate();
            this.firstAction = false;
            this.handleCursor(this.getDatatypeFromSigle(this.splittedViewModel[0]));
            return false;
        }
        if (key === 'Backspace' || key === 'Delete') {
            this.handleDelete(actualPosition);
        }
        if (key === 'ArrowLeft') {
            if (this.arrowBehaviours === ArrowBehaviours.circular_with_position_and_control) {
                this.leftRightArrowValidator(actualPosition);
            }
            this.handleCursor(this.getNextOrPrevDatatype(actualPosition, true))
        }
        if (key === 'ArrowRight') {
            if (this.arrowBehaviours === ArrowBehaviours.circular_with_position_and_control) {
                this.leftRightArrowValidator(actualPosition);
            }
            this.handleCursor(this.getNextOrPrevDatatype(actualPosition));
        }
        if (key === 'ArrowUp') {
            this.handleUpDownArrows(1, actualPosition);
        }
        if (key === 'ArrowDown') {
            this.handleUpDownArrows(-1, actualPosition);
        }

        if (/[0-9]/.test(key)) {
            switch (actualPosition) {
                case dateTypes.DAYS:
                    this.handleDays(key);
                    return false;
                case dateTypes.MONTHS:
                    this.handleMonths(key);
                    return false;
                case dateTypes.YEARS:
                    this.handleYears(key);
                    return false;
                case dateTypes.HOURS:
                    this.handleTimeValues(key, () => this.hour, newVal => this.hour = newVal, 25, dateTypes.HOURS);
                    return false;
                case dateTypes.MINUTES:
                    this.handleTimeValues(key, () => this.minute, newVal => this.minute = newVal, 60, dateTypes.MINUTES);
                    return false;
                case dateTypes.SECONDS:
                    this.handleTimeValues(key, () => this.second, newVal => this.second = newVal, 60, dateTypes.SECONDS);
                    return false;
                default:
                    return false;
            }
        } else {
            return false;
        }
    }

    // ######################################## HANDLE & VALIDATION

    handleDays(newDayNumber): void {
        if (this.day[0] === '0') {
            this.day = this.day.substring(1);
        }
        if (this.day.length === 2) {
            this.day = '0' + newDayNumber;
            this.handleCursor(dateTypes.DAYS);
        } else {
            this.day = this.day + newDayNumber;
            if (Number(this.day) < 32 && this.monthOrDayValidator()) {
                this.handleCursor(this.getNextOrPrevDatatype(dateTypes.DAYS));
            } else {
                this.handleDelete(dateTypes.DAYS);
            }
        }
    }

    handleMonths(newMonthNumber): void {
        if (this.month[0] === '0') {
            this.month = this.month.substring(1);
        }
        if (this.month.length === 2) {
            this.month = '0' + newMonthNumber;
            this.handleCursor(dateTypes.MONTHS);
        } else {
            this.month = this.month + newMonthNumber;
            if (Number(this.month) < 13 && this.monthOrDayValidator()) {
                this.handleCursor(this.getNextOrPrevDatatype(dateTypes.MONTHS));
            } else {
                this.handleDelete(dateTypes.MONTHS);
            }
        }
    }

    handleYears(newYearNumber): void {
        if (!Number(this.year)) {
            this.year = '000' + newYearNumber;
            this.handleCursor(dateTypes.YEARS);
            return;
        }
        while (1 > 0) {
            if (this.year[0] === '0') {
                this.year = this.year.substring(1);
            } else {
                break;
            }
        }
        this.year = this.year + newYearNumber;
        const yearLength = this.year.length;
        switch (yearLength) {
            case 2:
                this.year = '00' + this.year;
                this.handleCursor(dateTypes.YEARS);
                break;
            case 3:
                this.year = '0' + this.year;
                this.handleCursor(dateTypes.YEARS);
                break;
            case 4:
                if (Number(this.year) <= this.maxYear && Number(this.year) >= this.minYear && this.monthOrDayValidator()) {
                    this.handleCursor(this.getNextOrPrevDatatype(dateTypes.YEARS));
                    break;
                }
            default:
                this.year = 'reset'
                this.handleYears(newYearNumber);
                break;
        }
    }

    handleTimeValues(newMinuteNumber: number, getter: () => string, setter: (newVal) => void, max: number, actualDateType: dateTypes): void {
        if (getter()[0] === '0') {
            setter(getter().substring(1));
        }
        if (getter().length === 2) {
            setter('0' + newMinuteNumber);
            this.handleCursor(actualDateType)
        } else {
            setter(getter() + newMinuteNumber);
            if (Number(getter()) < max && Number(getter()) >= 0) {
                this.handleCursor(this.getNextOrPrevDatatype(actualDateType));
            } else {
                this.handleDelete(actualDateType);
            }
        }

    }


    handleDelete(memberToDelete: dateTypes): void {
        switch (memberToDelete) {
            case dateTypes.DAYS:
                this.day = 'dd';
                this.handleCursor(dateTypes.DAYS);
                break;
            case dateTypes.MONTHS:
                this.month = 'MM';
                this.handleCursor(dateTypes.MONTHS);
                break;
            case dateTypes.YEARS:
                this.year = 'yyyy';
                this.handleCursor(dateTypes.YEARS);
                break;
            case dateTypes.HOURS:
                this.hour = 'hh'
                this.handleCursor(dateTypes.HOURS);
                break;
            case dateTypes.MINUTES:
                this.minute = 'mm'
                this.handleCursor(dateTypes.MINUTES);
                break;
            case dateTypes.SECONDS:
                this.second = 'ss'
                this.handleCursor(dateTypes.SECONDS);
                break;
            default:
                break;
        }
    }

    handleTab(actualPosition: dateTypes): void {
        this.handleCursor(this.getNextOrPrevDatatype(actualPosition));
    }

    handleUpDownArrows(valueToAdd: number, actualPosition: dateTypes): void {
        switch (actualPosition) {
            case dateTypes.DAYS:
                this.increaseOrDecrease(valueToAdd, actualPosition, () => this.day, newD => this.day = newD, 1, 31);
                break;
            case dateTypes.MONTHS:
                this.increaseOrDecrease(valueToAdd, actualPosition, () => this.month, newM => this.month = newM, 1, 12);
                break;
            case dateTypes.YEARS:
                this.increaseOrDecrease(valueToAdd, actualPosition, () => this.year, newY => this.year = newY, this.minYear, this.maxYear, true);
                break;
            case dateTypes.HOURS:
                this.increaseOrDecrease(valueToAdd, actualPosition, () => this.hour, newH => this.hour = newH, 0, 23);
                break;
            case dateTypes.MINUTES:
                this.increaseOrDecrease(valueToAdd, actualPosition, () => this.minute, newH => this.minute = newH, 0, 59);
                break;
            case dateTypes.SECONDS:
                this.increaseOrDecrease(valueToAdd, actualPosition, () => this.second, newH => this.second = newH, 0, 59);
                break;
            default:
                break;
        }
    }

    increaseOrDecrease(valueToAdd: number, actualPosition: dateTypes, getter: () => string, setter: (newVal) => void, min: number, max: number, handlingYear?: boolean, customArrowB?: ArrowBehaviours): void {
        handlingYear ? handlingYear = true : handlingYear = false;
        switch (customArrowB ? customArrowB : this.arrowBehaviours) {
            case ArrowBehaviours.circular_with_position_and_control:
                let newNumber = Number(getter()) + valueToAdd;
                if (isNaN(newNumber)) {
                    setter(handlingYear ? this.minYear : '0' + min.toString());
                    this.handleCursor(actualPosition);
                    return;
                }
                if (newNumber === (max + 1)) {
                    setter(handlingYear ? this.minYear : '0' + min.toString());
                }
                else if (newNumber === (min - 1)) {
                    setter(handlingYear ? this.maxYear : max.toString());
                }
                else {
                    setter(this.zeroFormatter(newNumber, handlingYear));
                }
                this.handleCursor(actualPosition);
                break;

            case ArrowBehaviours.circular_without_position:
                if (actualPosition === dateTypes.DAYS || actualPosition === dateTypes.MONTHS || actualPosition === dateTypes.YEARS) {
                    const maxdays = this.quantifyMonthNumbOfDays(Number(this.month), Number(this.year));
                    const newDay = valueToAdd + Number(this.day);
                    if (newDay > maxdays) {
                        this.day = this.zeroFormatter(1, false);
                        this.month = this.zeroFormatter(Number(this.month) + 1, false);
                    } else if (newDay < 1) {
                        const prevMonth = (Number(this.month) - 1);
                        this.day = (this.quantifyMonthNumbOfDays(prevMonth, Number(this.year))).toString();
                        this.month = this.zeroFormatter(prevMonth, false);
                    } else {
                        this.day = this.zeroFormatter(newDay, false);
                    }
                    const monthNum = Number(this.month);
                    if (monthNum > 12) {
                        this.month = this.zeroFormatter(1, false);
                        this.year = this.zeroFormatter((Number(this.year) + 1), true);
                    } else if (monthNum < 1) {
                        this.month = this.zeroFormatter(12, false);
                        this.year = this.zeroFormatter((Number(this.year) - 1), true);
                    }
                    const yearNum = Number(this.year);
                    if (yearNum > this.maxYear) {
                        this.day = this.zeroFormatter(1, false);
                        this.month = this.zeroFormatter(1, false);
                        this.year = this.zeroFormatter(this.minYear, true);
                    }
                    if (yearNum < this.minYear) {
                        this.day = this.zeroFormatter(1, false);
                        this.month = this.zeroFormatter(1, false);
                        this.year = this.zeroFormatter(this.maxYear, true);
                    }
                    this.handleCursor(actualPosition);
                } else {
                    this.increaseOrDecrease(valueToAdd, actualPosition, getter, setter, min, max, handlingYear, ArrowBehaviours.circular_with_position_and_control);
                }
                break;
            case ArrowBehaviours.limited_with_control:
                let newNum = Number(getter()) + valueToAdd;
                if (isNaN(newNum)) {
                    setter(handlingYear ? this.minYear : '0' + min.toString());
                    this.handleCursor(actualPosition);
                    return;
                }
                if (newNum === min - 1 || newNum > max) {
                    this.handleCursor(this.getNextOrPrevDatatype(actualPosition));
                    return;
                }
                let stringNewNumber = this.zeroFormatter(newNum, handlingYear);
                const previousNum = getter();
                setter(stringNewNumber);
                if (!this.monthOrDayValidator()) {
                    setter(previousNum);
                    this.handleCursor(actualPosition);
                    return;
                }
                if (stringNewNumber === max.toString()) {
                    this.handleCursor(this.getNextOrPrevDatatype(actualPosition));
                } else {
                    this.handleCursor(actualPosition);
                }
                break;
        }
    }

    zeroFormatter(newNum: number, handlingYear: boolean) {
        newNum = isNaN(newNum) ? 1 : newNum
        return ("00000" + newNum.toString()).slice(handlingYear ? -4 : -2)
    }

    quantifyMonthNumbOfDays(month: number, year: number): number {
        switch (month) {
            case 2:
                return (year % 4 == 0 && year % 100) || year % 400 == 0 ? 29 : 28;
            case 9: case 6: case 4: case 11:
                return 30;
            default:
                return 31;
        }
    };

    monthOrDayValidator(): boolean {
        const actualDay = Number(this.day),
            actualYear = Number(this.year),
            actualMonth = Number(this.month);
        if (!(isNaN(actualDay) || isNaN(actualMonth) || isNaN(actualYear))) {
            if (actualDay > this.quantifyMonthNumbOfDays(actualMonth, actualYear)) {
                return false;
            }
        }
        return true;
    }

    leftRightArrowValidator(actualPosition: dateTypes): void {
        if (!this.monthOrDayValidator()) {
            this.handleDelete(actualPosition);
        }
    }

    replaceWithActualDate(): void {
        const actualDate = new Date();
        switch (this.viewModel.length) {
            case 10:
                this.resetDate(actualDate);
                break;
            case 5: case 8:
                this.resetHours(actualDate);
                break;
            default:
                this.resetHours(actualDate);
                this.resetDate(actualDate);
                break;
        }
    }

    resetHours(actualDate: Date): void {
        this.hour = this.zeroFormatter(actualDate.getHours(), false);
        this.minute = this.zeroFormatter(actualDate.getMinutes(), false);
        this.second = this.zeroFormatter(actualDate.getSeconds(), false);
    }

    resetDate(actualDate: Date): void {
        this.day = this.zeroFormatter(actualDate.getDate(), false);
        this.month = this.zeroFormatter((actualDate.getMonth() + 1), false);
        this.year = this.zeroFormatter(actualDate.getFullYear(), true);
    }

    isDateNull(): boolean {
        const array = [...this.splittedHtmlValueBeforeFormat];
        const output = array.every(element => isNaN(Number(element)))
        return output
    }

    // ##################################### CURSOR POSITION

    determinePositionBasedOnModel(cursorPosition: number): dateTypes {
        const sigleOfPosition = this.viewModel[cursorPosition];
        const output = this.getDatatypeFromSigle(sigleOfPosition);
        return output !== null ? output : this.determinePositionBasedOnModel(cursorPosition - 1);
    }

    handleCursor(destination?: dateTypes): void {
        switch (destination) {
            case dateTypes.DAYS:
                const indexOfDays = this.viewModel.indexOf('dd');
                this.inputElement.setSelectionRange(indexOfDays + 1, indexOfDays + 1);
                break;
            case dateTypes.MONTHS:
                const indexOfMonths = this.viewModel.indexOf('MM');
                this.inputElement.setSelectionRange(
                    indexOfMonths + 1,
                    indexOfMonths + 1
                );
                break;
            case dateTypes.YEARS:
                const indexOfYears = this.viewModel.indexOf('yyyy');
                this.inputElement.setSelectionRange(indexOfYears + 3, indexOfYears + 3);
                break;
            case dateTypes.HOURS:
                const indexOfHours = this.viewModel.indexOf('hh');
                this.inputElement.setSelectionRange(indexOfHours + 1, indexOfHours + 1);
                break;
            case dateTypes.MINUTES:
                const indexOfMinutes = this.viewModel.indexOf('mm');
                this.inputElement.setSelectionRange(indexOfMinutes + 1, indexOfMinutes + 1);
                break;
            case dateTypes.SECONDS:
                const indexOfSeconds = this.viewModel.indexOf('ss');
                this.inputElement.setSelectionRange(indexOfSeconds + 1, indexOfSeconds + 1);
                break;
            default:
                break;
        }
    }

    moveCursorToStartPosition(): void {
        switch (this.splittedViewModel[0]) {
            case 'dd':
                this.handleCursor(dateTypes.DAYS);
                break;
            case 'MM':
                this.handleCursor(dateTypes.MONTHS);
                break;
            case 'yyyy':
                this.handleCursor(dateTypes.YEARS);
                break;
            case 'hh':
                this.handleCursor(dateTypes.HOURS);
                break;
            case 'mm':
                this.handleCursor(dateTypes.MINUTES);
                break;
            case 'ss':
                this.handleCursor(dateTypes.SECONDS);
                break;
        }
    }


    getNextOrPrevDatatype(actualDatatype: dateTypes, previous?: boolean): dateTypes {
        const actualSigle = this.getSigleFromDateType(actualDatatype);
        const prevOrNext = previous ? -1 : 1;
        const next = this.splittedViewModel[this.splittedViewModel.findIndex(i => i === actualSigle) + prevOrNext];
        if (next) {
            return this.getDatatypeFromSigle(next);
        } else {
            this.inputElement.blur();
        }
    }

    getDatatypeFromSigle(sigle: string): dateTypes {
        switch (sigle) {
            case 'dd': case 'd':
                return dateTypes.DAYS;
            case 'MM': case 'M':
                return dateTypes.MONTHS;
            case 'yyyy': case 'y':
                return dateTypes.YEARS;
            case 'hh': case 'h':
                return dateTypes.HOURS;
            case 'mm': case 'm':
                return dateTypes.MINUTES;
            case 'ss': case 's':
                return dateTypes.SECONDS;
            default:
                return null;
        }
    }

    getSigleFromDateType(dateType: dateTypes): string {
        switch (dateType) {
            case dateTypes.DAYS:
                return 'dd';
            case dateTypes.MONTHS:
                return 'MM';
            case dateTypes.YEARS:
                return 'yyyy';
            case dateTypes.HOURS:
                return 'hh';
            case dateTypes.MINUTES:
                return 'mm';
            case dateTypes.SECONDS:
                return 'ss';
            default:
                return null;
        }
    }




    //////////////////////////////
}

enum dateTypes {
    'DAYS',
    'MONTHS',
    'YEARS',
    'HOURS',
    'MINUTES',
    'SECONDS'
}


