import { ValidationResponse } from "../ValidationModels";

export function ValidateIsRequiredHandler(value: any) : ValidationResponse {
    if (typeof value === 'undefined' || value === '' || value === null || value.length <= 0) {
        return new ValidationResponse(false, 'isRequired');
    }
    return new ValidationResponse(true);
}