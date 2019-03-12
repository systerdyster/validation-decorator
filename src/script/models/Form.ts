import { ValidatedForm, ValidateProp, IValidator } from "script/decorators/ValidatedForm";

export class ValidationForm {
    $validation: any;
}

export class IsRequired implements IValidator {
    validate(value: any): boolean {
        if (typeof value === 'undefined' || value === '' || value === null || value.length <= 0) {
            return false;
        }
        return true;
    }   
    public get name() { return 'isRequired' };
}


@ValidatedForm()
export class Form extends ValidationForm {

    @ValidateProp({ validators: [new IsRequired()] })
    public name: string;

    public age: number;
}