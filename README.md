# Date Mask Directive
#### Simple directive to simulate the html mask of the input `type="date"` with a custom configuration.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.5.  

## Table of contents
* Installation
* Description
* Configurations
    * Date Configuration
    * Time Configuration
    * Date-Time Configuration
    * Separators
* Additional Settings
    * Arrows Behaviour
    * First Value Behaviour
    * Min Max year


&nbsp;  
&nbsp; 
## Installation and basic usage
1. Include the mask-directive folder in your project
2. Include it in the declaration inside `app.module.ts` file   
`declarations: [AppComponent, MaskDirective]`
3. Call it in the `<input/>` tag where is necessary  
The type of the input should be `type="text"`
 ```
  <form>
        <input  
        [formControl]="formControl"        
        type="text"          
        dateMask
        />
    </form>
```
> If no configuration is provided the default view will be: _yyyy-MM-dd hh:mm:ss_


&nbsp;  
&nbsp;  


## Description
The directive is able to copy the behaviour of the html `type="date"` input allowing a greater control of the value visualization.
It can accept all time and date possible configurations (dd/mm/yyyy, yyyy/dd/mm and so on) 
and also different separators.  
The directive modifies the HTML value and also the value of the FormControl connected the the input in real time.  
It stops the propagation of the key event and react according to the configuration.  
It also applies a validation on the new value; if the validation is negative the directive returns the sigles corresponding to the configuration (eg. dd/mm/yyyy).


&nbsp;  
&nbsp;  

## Configurations
```
import { MaskConfigOptions, Separators, ArrowBehaviours } from "./mask-directive/mask-options";
```
> To use the mask's configuration import the content of the  `mask-options.ts` file and configure your own object of type MaskConfigOptions  and then inject it in the directive.  
```
        <input
          type="text"
          dateMask
          [maskOptions]="maskConfigOptions"
        />
```
 
 1. **`MaskConfigOptions`** : `type` which contains all the possible configurations
 2. **`Separators`** : enum with all the separators accepted
 3. **`ArrowBehaviours`** : enum with all the arrow scrolling possibilities


&nbsp;  
### Date Configuration
To configure the date only style visualization provide a string which contains **all** the date sigle write in the desired order whitout separations: _dd_, _MM_, _yy_.
```
public myMaskConfigOptions: MaskConfigOptions = {
    dateConfiguration: 'MMddyy'
};
```
 
### Time Configuration
To configure the time only visualization provide a string which contains **at least hours and minutes** sigles: _hh_, _mm_, _ss_.  
The seconds sigle it's optional; use it if you want to show seconds   

```
public myMaskConfigOptions: MaskConfigOptions = {
    timeConfiguration: 'hhmm'
};
```

### Date-Time Configuration
To configure the date-time full visualization provide **both** date and time configurations.
```
public myMaskConfigOptions: MaskConfigOptions = {
    dateConfiguration: 'MMyydd',
    timeConfiguration: 'ssmmhh'
};
```

### Separators 
MaskOptions type contains 3 properties to configure the date, the time  and the date-time separators.  
Use the enum `Separators` to assign the desired value.  
Each of these options has a default value: `dash` for date, `dot` for time, `space` for date-time.
```
public myMaskConfigOptions: MaskConfigOptions = {
    dateConfiguration: 'MMyydd',
    timeConfiguration: 'ssmmhh',
    dateSeparator: Separators.colon,
    timeSeparator: Separators.space,
    dateTimeSeparator: Separators.dot,
};
```


&nbsp;  
&nbsp;  

## Additional Settings
### Arrows Behaviour
The `ArrowBehaviours` enum contains 3 possible actions for up/down arrow keys.
```
    enum ArrowBehaviours {
    circular_without_position,
    circular_with_position_and_control,
    limited_with_control,
}
```
1. #### `circular_without_position`: when up or down arrow is held down in every value of the date days increase or decrease by one, when the maximum or minimum days for the month is reached the month increase or decrease by one and the day start from one. The year has the same behaviour according to the month




### First Value Behaviour
### Min Max year