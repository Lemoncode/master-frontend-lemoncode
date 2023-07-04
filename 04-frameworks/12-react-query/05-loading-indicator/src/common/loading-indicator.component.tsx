import React from "react";
import { ThreeDots } from "react-loader-spinner";
import { usePromiseTracker } from "react-promise-tracker";

export const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThreeDots color="#2BAD60" height="100" width="100" />
      </div>
    )
  );
};
