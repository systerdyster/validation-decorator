import { ValidationResponse } from "../ValidationModels";

export async function ValidateIsValidAsyncHandler(value: string | undefined | number) : Promise<ValidationResponse> {
    //typical server request simulated.
    await new Promise(res => setTimeout(res, 10000));

    return new ValidationResponse(true);
}