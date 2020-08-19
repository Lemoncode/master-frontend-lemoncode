import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFormikValidation } from '@lemoncode/fonk-formik';

const validationSchema: ValidationSchema = {
  field: {
    month: [Validators.required],
    year: [Validators.required],
  },
};

export const formValidation = createFormikValidation(validationSchema);
