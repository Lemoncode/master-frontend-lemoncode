import React from "react";
import { useParams } from "react-router-dom";
import { MovementContainer } from "pods/movement-list";
import { AppLayout } from "layouts";

export const MovementsScene = () => {
  const { id } = useParams();
  return (
    <AppLayout>
      <MovementContainer id={id} />
    </AppLayout>
  );
};
