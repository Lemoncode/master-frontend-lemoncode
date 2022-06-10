import React from "react";
import { UserProfile, createEmptyUserProfile } from "./profile.vm";

interface Context extends UserProfile {
  setUserProfile: (userProfile: UserProfile) => void;
}

const noUserLogin = "no user login";

export const ProfileContext = React.createContext<Context>({
  userName: noUserLogin,
  setUserProfile: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
});

interface Props {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<Props> = ({ children }) => {
  const [userProfile, setUserProfile] = React.useState<UserProfile>(
    createEmptyUserProfile()
  );

  return (
    <ProfileContext.Provider
      value={{
        userName: userProfile.userName,
        setUserProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
