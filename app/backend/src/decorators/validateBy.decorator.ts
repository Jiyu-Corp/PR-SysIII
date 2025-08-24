import { ValidateBy, ValidationOptions, buildMessage } from 'class-validator';

export function ValidateFn<T>(
  fn: (value: T) => boolean,
  message?: string,
  validationOptions?: ValidationOptions,
) {
  return ValidateBy(
    {
      name: 'validateFn',
      validator: {
        validate: (value) => fn(value),
        defaultMessage: buildMessage(
          () => message ?? 'Validation failed',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}