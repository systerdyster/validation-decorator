export function ValidateProp(options?: ValidationOptions) {

    let validationMethods = [];

    return function (target: any, propertyName: string | symbol) {
        
        if (!target.hasOwnProperty('$validation')) {
            target.$validation = {};
        }

        const key = `$${String(propertyName)}`;
        target.$validation[key] = { $validators: [], $isValid: true };
        if (options && options.validators) {
            target.$validation[key].$validators = options.validators;
            validationMethods.push(options.validators);
        }
 
        let val: any = target[propertyName];

        const getter = () => {
            return val;
        }

        const setter = (next: any) => {
            val = next;
        } 
        /*
        const setter = (next: any) => {
            delete target.$validation[propertyName];
            target.$validation[propertyName] = {};

            let isValid = true;
            if (options && options.validators) {
                for (let i = 0; i < options.validators.length; i++) {
                    let nextVal = options.validators[i];
                    if (!nextVal.validate(next)) {
                        if (!target.$validation[propertyName].hasOwnProperty('$error')) {
                            target.$validation[propertyName].$error = {};
                        }
                        
                        let msg = nextVal.errorMessage || nextVal.name;
                        target.$validation[propertyName].$error[nextVal.name] = msg;
                        isValid = false;
                    }
                }
                target.$validation[propertyName].$isValid = isValid;
            }
            val = next;
        }

        const validate = function (_self: any) {
            console.log('??', _self);
            const val = _self[propertyName];

            delete target.$validation[propertyName];
            target.$validation[propertyName] = {};

            let isValid = true;
            if (options && options.validators) {
                for (let i = 0; i < options.validators.length; i++) {
                    let nextVal = options.validators[i];
                    if (!nextVal.validate(val)) {
                        if (!target.$validation[propertyName].hasOwnProperty('$error')) {
                            target.$validation[propertyName].$error = {};
                        }
                        
                        let msg = nextVal.errorMessage || nextVal.name;
                        target.$validation[propertyName].$error[nextVal.name] = msg;
                        isValid = false;
                    }
                }
                target.$validation[propertyName].$isValid = isValid;
            }
        }; */

         Object.defineProperty(target, propertyName, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });  
    }
} 


/* export function ValidatedForm<T extends { new(...args: any[]):{}}>(constructor: T) {
    constructor.prototype.$validation = {};
    //Object.defineProperty(constructor.prototype , '$validation', { value: {} });

    return class extends constructor {
        //$validation = {};
    }
} */

/* export function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    let set = descriptor.set;
    descriptor.set = function (value: T) {
        let type = Reflect.getMetadata("design:type", target, propertyKey);
        if (!(value instanceof type)) {
            throw new TypeError("Invalid type.");
        }
        if (set)
            set(value);
    }
} */

export function ValidatedForm(config?: Object) : ClassDecorator {
    return function validateForm(constructor) {
        constructor();

        /* Object.defineProperty(constructor.prototype, '$validation', {
            writable: true,
            value: {}
        }); */
    }
}

export interface IValidator {
    validate(value: any): boolean;
    name: string;
    errorMessage?: string;
}

export interface IAsyncValidator {
    validate(value: any): Promise<boolean>;
    name: string;
    errorMessage?: string;
}

export type ValidationOptions = {
    errorMessage?: string
    validators?: IValidator[],
    asyncValidators?: IAsyncValidator[]
}