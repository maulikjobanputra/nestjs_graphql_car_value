import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueConstraint, IsUniqueInterface } from 'src/utils/unique-validator';

export function isUnique(options: IsUniqueInterface, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint
    });
  };
}
