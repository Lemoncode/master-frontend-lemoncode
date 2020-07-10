import { ValidationConstraints, Validators, createFormValidation } from 'lc-form-validation';

const validationConstraints: ValidationConstraints = {
  fields: {
    name: [
      { validator: Validators.required },
    ],
    password: [
      { validator: Validators.required },
    ],
  },
};

export const validations = createFormValidation(validationConstraints);
