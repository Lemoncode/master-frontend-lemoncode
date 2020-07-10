import {
  ValidationConstraints,
  createFormValidation,
  Validators,
} from 'lc-form-validation';
import { hasItems } from '../../../common/validations/hasItems';

const constraints: ValidationConstraints = {
  fields: {
    name: [{ validator: Validators.required }],
    ingredients: [{ validator: hasItems }],
  },
};

export const validations = createFormValidation(constraints);
