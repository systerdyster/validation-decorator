import { ValidationResponse } from "../ValidationModels";


export function ValidateIsEmailHandler(value: string, regExp: RegExp) : ValidationResponse {
    const _emailRegEx: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (_emailRegEx.test(value)) {
        return new ValidationResponse(true);
    }
    return new ValidationResponse(false, 'isEmail');
}