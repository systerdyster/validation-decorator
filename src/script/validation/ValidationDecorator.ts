import { ValidationOptions, ValidationResponse } from './ValidationModels';

export function ValidateProp(options: ValidationOptions) : PropertyDecorator {

    const evaluateHandlers = (_this: any, _key: string, nextValue: any) : boolean => {
        const validators: Array<(value: any) => ValidationResponse> = _this.__validation[_key].__validators;
        let isValid = true;
        let count = 0;

        if (validators.length > 0) {
            for (let i = 0; i < validators.length; i++) {
                const result = validators[i](nextValue);
                if (!result.isValid) {
                    isValid = false;
                    let key = String(count);
                    if (result.errorMsg) {
                        key = result.errorMsg;
                    }
                    if (!_this.__validation[_key].$error) {
                        _this.__validation[_key].$error = [];
                    }
                    _this.__validation[_key].$error.push(key);
                }
                count++;
            };
        }
        return isValid;
    }

    const evaluteAsyncHandlers = async (_this: any, _key: string, nextValue: any) : Promise<boolean> => {
        const validators: Array<(value: any) => Promise<ValidationResponse>> = _this.__validation[_key].__asyncValidators;
        let isValid = true;
        let count = 100;

        if (validators.length > 0) {
            for (let i = 0; i < validators.length; i++) {
                const result = await validators[i](nextValue);

                if (!result.isValid) {
                    isValid = false;
                    let key = String(count);
                    if (result.errorMsg) {
                        key = result.errorMsg;
                    }
                    if (!_this.__validation[_key].$error) {
                        _this.__validation[_key].$error = [];
                    }
                    _this.__validation[_key].$error.push(key);
                }
                count++;
            }
        }
        return isValid;
    }

    return function (target: any, propertyName: string | symbol) {
        const _key = `${String(propertyName)}`;
        const _validators: Array<(value: any) => ValidationResponse> = [];
        const _asyncValidators: Array<(value: any) => Promise<ValidationResponse>> = [];

        if (options.validators) {
            _validators.push(...options.validators);
        };

        if (options.asyncValidators) {
            _asyncValidators.push(...options.asyncValidators);
        };

        if (!target.hasOwnProperty('$validation')) {
            Object.defineProperty(target, '$validation', {
                get: function () {
                    let _this = this;
                    return {
                        get $isValid() {
                            let isValid = true;
                            Object.keys(_this.__validation).forEach((key) => {
                                if (!_this.__validation[key].$isValid) {
                                    isValid = false;
                                }
                            });
                            return isValid;
                        },
                        get $isDirty() {
                            let isDirty = false;
                            Object.keys(_this.__validation).forEach((key) => {
                               if (_this.__validation[key].$isDirty) {
                                   isDirty = true;
                               }
                           }); 
                           return isDirty;
                        },
                        get $isPending() {
                            let isPending = false;
                            Object.keys(_this.__validation).forEach((key) => {
                               if (_this.__validation[key].$isPending) {
                                   isPending = true;
                               }
                           }); 
                           return isPending;
                        }
                    }
                },
                enumerable: true
            });
        }

        const validate = async (_this: any, nextValue: any) => {
            delete _this.__validation[_key].$error;
            _this.__validation[_key].$isPending = true;
            
            let syncIsValid = evaluateHandlers(_this, _key, nextValue);
            let asyncIsValid = await evaluteAsyncHandlers(_this, _key, nextValue, );

            _this.__validation[_key].$isPending = false;
            _this.__validation[_key].$isValid = (syncIsValid && asyncIsValid);
            _this.__validation[_key].$isDirty = true;
        };

        function setupValidation (_this: any) {
            if (!_this.hasOwnProperty('__validation')) {
                Object.defineProperty(_this, '__validation', {
                    value: {},
                    writable: true,
                    configurable: true
                });
            }

            Object.defineProperty(_this.__validation, _key, {
                value: { 
                    '$isValid': false, 
                    '$isDirty': false, 
                    '$isPending': false,
                    '__validators': _validators,
                    '__asyncValidators': _asyncValidators
                },
                writable: true,
                enumerable: true
            });
        }
        
        Object.defineProperty(target, propertyName, {
            get: function() {
                return this['__' + String(propertyName)];
            },
            set: function (nextValue: any) {
                setupValidation(this); 

                this['__' + String(propertyName)] = nextValue;
                validate(this, nextValue);
            },
            enumerable: true,
            configurable: true
        });
    }
} 