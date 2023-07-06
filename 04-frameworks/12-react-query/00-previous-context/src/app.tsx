import React from "react";
import { RouterComponent } from "@/core";
import { ProfileProvider } from "@/core/providers";
import { MemberListProvider } from "@/pods/list";
import { LoadingIndicator } from "@/common/components";

export const App = () => {
  return (
    <ProfileProvider>
      <MemberListProvider>
        <RouterComponent />
        <LoadingIndicator />
      </MemberListProvider>
    </ProfileProvider>
  );
};
