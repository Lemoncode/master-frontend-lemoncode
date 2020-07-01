import React from 'react';

export const FormComponent = props => {
  const { onSubmit, children, className } = props;

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};
