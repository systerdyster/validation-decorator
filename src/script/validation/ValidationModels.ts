export class ValidationResponse {
    public isValid: boolean;
    public errorMsg?: string;

    constructor(isValid: boolean, errorMsg?: string) {
        this.isValid = isValid;
        if (errorMsg) {
            this.errorMsg = errorMsg;
        }
    }
};

export type ValidationOptions = {
    validators?: Array<(value: any) => ValidationResponse>,
    asyncValidators?: Array<(value: any) => Promise<ValidationResponse>>
};

export class ValidationForm {
    $validation?: IValidationActions;
    __validation?: IValidationGroup;
}

export interface IValidationActions {
    $isValid: boolean;
    $isDirty: boolean;
    $isPending: boolean;
}

export interface IValidationGroup {
    [key: string] : IValidationActions;
}