import { ValidationResponse } from "../ValidationModels";

export function ValidateIsMinHandler(value: string | undefined | number, minValue: number) : ValidationResponse {
    if (typeof(value) === 'undefined' || value === null || value === '' || value === ' ') {
        return new ValidationResponse(false, 'isNullOrEmpty');
    }

    if (typeof value === 'number') {
        if (value >= minValue) {
            return new ValidationResponse(true);
        }
        return new ValidationResponse(false, 'isMin');
    }

    if (value!.length >= minValue) {
        return new ValidationResponse(true);
    }
    return new ValidationResponse(false, 'isMin');
}