import React from "react";
import { AppLayout } from "@/layouts";
import { ListContainer } from "@/pods/list";

interface MemberEntity {
  id: string;
  login: string;
  avatar_url: string;
}

export const ListPage: React.FC = () => {
  return (
    <AppLayout>
      <ListContainer />
    </AppLayout>
  );
};
