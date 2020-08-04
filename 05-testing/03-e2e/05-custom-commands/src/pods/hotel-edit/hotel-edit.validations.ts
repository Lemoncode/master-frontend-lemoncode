import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFormikValidation } from '@lemoncode/fonk-formik';
import { minNumber } from '@lemoncode/fonk-min-number-validator';

const validationSchema: ValidationSchema = {
  field: {
    name: [Validators.required],
    description: [Validators.required],
    rating: [
      {
        validator: minNumber,
        customArgs: { minValue: 3 },
      },
    ],
    address: [Validators.required],
    city: [Validators.required],
  },
};

export const formValidation = createFormikValidation(validationSchema);
