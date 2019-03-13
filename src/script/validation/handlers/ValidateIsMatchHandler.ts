import { ValidationResponse } from "../ValidationModels";

export function ValidateIsMatchHandler(value: string, regExp: RegExp) : ValidationResponse {
    if (regExp.test(value)) {
        return new ValidationResponse(true);
    }
    return new ValidationResponse(false, 'isMatch');
}