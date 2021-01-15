import {
  createDefaultValidationResult,
  ValidationResult,
} from "@lemoncode/fonk";

interface Login {
  name: string;
  password: string;
}

const createEmptyLogin = (): Login => ({
  name: "",
  password: "",
});

interface LoginError {
  name: ValidationResult;
  password: ValidationResult;
}

const createEmptyLoginError = () => ({
  name: createDefaultValidationResult(),
  password: createDefaultValidationResult(),
});

type ResultLoginError = Record<keyof LoginError, boolean | string>;

export {
  Login,
  createEmptyLogin,
  LoginError,
  ResultLoginError,
  createEmptyLoginError,
};
