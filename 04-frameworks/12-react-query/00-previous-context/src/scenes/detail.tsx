import React from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/layouts";
import { DetailContainer } from "@/pods/detail";

export const DetailPage: React.FC = () => {
  const { id } = useParams();
  
  return (
    <AppLayout>
      <DetailContainer id={id} />
    </AppLayout>
  );
};
