import { ValidationResponse } from "../ValidationModels";

export function ValidateIsMaxHandler(value: string | undefined | number, maxValue: number) : ValidationResponse {
    if (typeof(value) === 'undefined' || value === null || value === '' || value === ' ') {
        return new ValidationResponse(false, 'isNullOrEmpty');
    }

    if (typeof value === 'number') {
        if (value <= maxValue) {
            return new ValidationResponse(true);
        }
        return new ValidationResponse(false, 'isMax');
    }

    if (value!.length <= maxValue) {
        return new ValidationResponse(true);
    }
    return new ValidationResponse(false, 'isMax');
}