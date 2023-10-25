import * as apiModel from "core/auth/api";
import * as viewModel from "./login.vm";

export const mapCredentialFromVmToApi = (
  credential: viewModel.Credential
): apiModel.LoginCredential => ({
  email: credential.email,
  password: credential.password,
});
