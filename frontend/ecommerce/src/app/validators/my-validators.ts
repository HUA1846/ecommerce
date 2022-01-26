import { FormControl, ValidationErrors } from "@angular/forms";

export class MyValidators {

    static whiteSpaceOnly(control: FormControl): ValidationErrors {

        if(control.value != null && control.value.trim().length === 0) {
            return {'whiteSpaceOnly': true};
        }
        
        return null;
    }
}