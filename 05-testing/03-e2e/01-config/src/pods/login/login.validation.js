import { createFormValidation, Validators } from '@lemoncode/fonk';

const validationSchema = {
  field: {
    login: [Validators.required.validator],
    password: [Validators.required.validator],
  },
};

export const formValidation = createFormValidation(validationSchema);
