import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFormikValidation } from '@lemoncode/fonk-formik';

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
  },
};

export const formValidation = createFormikValidation(validationSchema);
