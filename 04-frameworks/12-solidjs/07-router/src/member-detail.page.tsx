import { useParams } from "@solidjs/router";
import { Component } from "solid-js";

export const MemberDetailPage: Component = () => {
  const params = useParams();

  return <h1>Hello from Member Detail Page. Member id: {params.id}</h1>;
};
