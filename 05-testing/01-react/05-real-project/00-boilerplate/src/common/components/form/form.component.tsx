import React from 'react';

interface Props {
  onSubmit: () => void;
  className?: string;
}

export const FormComponent: React.FunctionComponent<Props> = props => {
  const { onSubmit, className, children } = props;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};
