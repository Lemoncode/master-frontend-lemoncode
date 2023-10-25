import React from "react";
import { MovementList } from "./movement-list.component";
import { MovementVm } from "./movement-list.vm";
import { getMovementList } from "./api";
import { mapMovementListFromApiToVm } from "./movement-list.mappers";

interface Props {
  id: string;
}

export const MovementContainer: React.FC<Props> = (props) => {
  const { id } = props;
  const [movementList, setMovementList] = React.useState<MovementVm[]>([]);

  const loadMovementList = async () => {
    const movementList = await getMovementList(id);
    setMovementList(mapMovementListFromApiToVm(movementList));
  };

  React.useEffect(() => {
    loadMovementList();
  }, []);

  return <MovementList movementList={movementList} />;
};
