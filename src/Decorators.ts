export function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

export function configurable(value: boolean) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}
