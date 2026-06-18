import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

const flattenValidationErrors = (
  errors: ValidationError[],
  parentPath = '',
): { field: string; message: string }[] => {
  return errors.flatMap((error) => {
    const field = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    const currentErrors = error.constraints
      ? Object.values(error.constraints).map((message) => ({
          field,
          message,
        }))
      : [];

    const childErrors = error.children?.length
      ? flattenValidationErrors(error.children, field)
      : [];

    return [...currentErrors, ...childErrors];
  });
};

export const validationExceptionFactory = (errors: ValidationError[]) => {
  return new BadRequestException({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: flattenValidationErrors(errors),
    },
  });
};
