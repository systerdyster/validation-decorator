import { ValidationForm } from 'script/validation/ValidationModels';
import { ValidateIsMinHandler, ValidateIsMatchHandler, ValidateIsRequiredHandler } from 'script/validation/handlers';
import { ValidateProp } from 'script/validation/ValidationDecorator';

export class Template extends ValidationForm {

    @ValidateProp({
        validators: [
            x => ValidateIsMinHandler(x, 3)
        ]
    })
    public name: string;
    
    @ValidateProp({ 
        validators: [
            x => ValidateIsMinHandler(x, 5), 
            x => ValidateIsMatchHandler(x, /^[a-zA-Z0-9]+$/)
        ]})
    public eventCode: string;
    
    public description: string;

    public imageUrl: string;

    @ValidateProp({ validators: [x => ValidateIsRequiredHandler(x)]})
    public startDate: string;

    @ValidateProp({ validators: [x => ValidateIsRequiredHandler(x)]})
    public endDate: string;
    
    @ValidateProp({ validators: [x => ValidateIsRequiredHandler(x)]})
    public client: string;

    @ValidateProp({ validators: [x => ValidateIsMatchHandler(x, /^\d+/)]})
    public clientId: number | undefined;

    constructor() {
        super();
        this.name = '';
        this.eventCode = '';
    }
}