import { ValidationOptions, ValidationResponse } from './ValidationModels';

export function ValidateProp(options: ValidationOptions) : PropertyDecorator {
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

        function validate (_this: any, next: any) {
            let isValid = true;
            let count = 0;
            delete _this.__validation[_key].$error;
            _this.__validation[_key].$isPending = true;
            
            if (_this.__validation[_key].__validators.length > 0) {
                _this.__validation[_key].__validators.forEach((validator: Function) => {
                    const result = validator(next);
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
                });
            }

            if (_this.__validation[_key].__asyncValidators.length > 0) {
                _this.__validation[_key].__asyncValidators.forEach(async (validator: Function) => {
                    const result = await validator(next);
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
                });
            }

            _this.__validation[_key].$isPending = false;
            _this.__validation[_key].$isValid = isValid;
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
                    '$isValid': true, 
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