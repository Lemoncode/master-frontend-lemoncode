import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFormikValidation } from '@lemoncode/fonk-formik';

const validationSchema: ValidationSchema = {
  field: {
    user: [Validators.required],
    password: [Validators.required],
  },
};

export const formValidation = createFormikValidation(validationSchema);
