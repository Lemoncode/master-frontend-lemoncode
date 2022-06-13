import { FC } from "react";
import config from "./env-config";

export const HelloComponent: FC = () => {
  return (
    <>
      <h2>Hello from React</h2>
      <p>Api server is {config.API_BASE}</p>
      <p>Feature A is {config.IS_FEATURE_A_ENABLED ? "enabled" : "disabled"}</p>
    </>
  );
};
