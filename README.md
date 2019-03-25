# validation-decorator

I move a lot between framework/libraries at work and one thing that always frustrates me is when forms needs to be validated. It's usually not even consistant though out a single project and can wary greatly. Something that's always extra painful is when you need to do async validation.. need to check that value against a server or something and every time you do it, there is a new special solution to it.

I got tired of how poorly this is treated in javascript and surely there must be a more consistent way. So i started to experiment with decorators a while back for doing simple stuff like validation and what not. This is a more "code" way to do it, or maybe more how I was used to when doing a lot of c#. Taste might not be for everyone, but for me, it's fantastic ;)

The idea is that you decorate your model properties that need validation with this decorator. List the validators used for it, sync and async as you can see in this example. 

## example model

``` typescript

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
        ],
        asyncValidators: [x => ValidateIsValidAsyncHandler(x)]
    })
    public eventCode: string;
    
    public description: string;

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
    }
}
```

The inheritance is only for type-help when accessing stuff. So not needed for it to work. If you don't care about your typescript you can ignore it.

## anyway.
What happen is that when decorated, then prototype is modified to contain information on what is supposed to happen. The properties decorated get their 'setters' modified, to validate when used. So when editing the value, it is automaticly evaluated and updated.

## the good stuff.
on the prototype, you can find a new property called $validation with 3 boolean values. $isDirty, $isPending, $isValid. These refer to the while object.

So for example if you wish to see if you model is valid, you can check against this property.

``` typescript
  const myTemplate = new Template();
  myTemplate.eventCode = 'test';
  
  myTemplate.$validation.$isValid  //false
```

now this might not be all that usefull if you can't access individual properties, but you can.

On the prototype you also have a detailed property called __ __validation.__ Here you can find detailed information for every property with validation in the same way. including an array with error messages. So you can check individual properties as so

``` typescript
myTemplate.__validation.eventCode.$isValid  //false
myTemplate.__validation.eventCode.$error  // ['isMin', 'isMatch']
```
So you could possibly display seperate errors messages depending on what the pain is by checking

```typescript
myTemplate.__validation.eventCode.$error.isMin
myTemplate.__validation.eventCode.$error.isMatch
```
If there is no error, the message with not exist. So you can always check if truthy and know there is an error.

In the same way you can also see if a validation is pending, for whole object or for specific property.

``` typescript
myTemplate.$validation.$isPending  //true
myTemplate.__validation.eventCode.$isPending  //true
```
