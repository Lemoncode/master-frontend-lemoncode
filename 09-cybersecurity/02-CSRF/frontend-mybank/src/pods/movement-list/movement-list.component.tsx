import React from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "core";
import { MovementVm } from "./movement-list.vm";

interface Props {
  movementList: MovementVm[];
}

export const MovementList: React.FC<Props> = (props) => {
  const { movementList } = props;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(routes.root);
  };
  return (
    <div className="container">
      <h1>Movement List</h1>
      <div className="movement-list-container">
        <span className="movement-list-header">Description</span>
        <span className="movement-list-header">Amount</span>
        <span className="movement-list-header">Transaction</span>
        {movementList.map((movement) => (
          <React.Fragment key={movement.id}>
            <span>{movement.description}</span>
            <span>{movement.amount}</span>
            <span>{movement.transaction}</span>
          </React.Fragment>
        ))}
      </div>

      <button onClick={handleNavigate} className="button-account-page">
        Back to the Accounts Page
      </button>
    </div>
  );
};
