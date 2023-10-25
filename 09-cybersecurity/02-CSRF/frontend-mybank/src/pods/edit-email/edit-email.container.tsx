import React from 'react'
import { useNavigate } from 'react-router-dom';
import { routes } from 'core';
import { EditEmail } from './edit-email.component';
import { editEmail } from './api';


export const EditEmailContainer: React.FC = () => {

  const navigate = useNavigate();

  const handleOnEmailEdit = async (newEmail: string) => {
    const response = await editEmail(newEmail);
    console.log(response);
    if (response.message === "Email changed") {
      alert(`Email changed successfully. New email: ${response.newEmail}`);
      navigate(routes.root);
    }
  }

  return <EditEmail onChangeEmail={handleOnEmailEdit} />
};
