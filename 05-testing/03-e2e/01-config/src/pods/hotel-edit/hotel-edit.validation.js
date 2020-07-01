import { createFormValidation, Validators } from '@lemoncode/fonk';
import { minNumber } from '@lemoncode/fonk-min-number-validator';

const validationSchema = {
  field: {
    name: [Validators.required.validator],
    description: [Validators.required.validator],
    rating: [
      {
        validator: minNumber.validator,
        customArgs: { minValue: 3 },
      },
    ],
    address: [Validators.required.validator],
    city: [Validators.required.validator],
  },
};

export const formValidation = createFormValidation(validationSchema);
