import {
  Validators,
  createFormValidation,
  ValidationSchema,
} from "@lemoncode/fonk";

const validationSchema: ValidationSchema = {
  field: {
    name: [Validators.required],
    password: [Validators.required],
  },
};

export const validations = createFormValidation(validationSchema);
