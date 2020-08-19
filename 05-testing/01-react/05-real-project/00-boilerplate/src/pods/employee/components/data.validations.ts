import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFormikValidation } from '@lemoncode/fonk-formik';
import { requiredByField } from '@lemoncode/fonk-required-by-field-validator';

export const validationSchema: ValidationSchema = {
  field: {
    name: [Validators.required],
    email: [
      {
        validator: Validators.required,
      },
      {
        validator: Validators.email,
      },
    ],
    temporalPassword: [
      {
        validator: requiredByField.validator,
        customArgs: {
          field: 'id',
          condition: fieldValue => fieldValue === '',
        },
      },
    ],
  },
};

export const formValidation = createFormikValidation(validationSchema);
