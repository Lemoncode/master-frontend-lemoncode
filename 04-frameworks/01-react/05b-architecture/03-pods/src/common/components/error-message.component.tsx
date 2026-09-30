interface Props {
  message: string;
}

export const ErrorMessage = (props: Props) => {
  const { message } = props;

  return (
    <div role="alert" className="alert alert-error">
      <span>{message}</span>
    </div>
  );
};
