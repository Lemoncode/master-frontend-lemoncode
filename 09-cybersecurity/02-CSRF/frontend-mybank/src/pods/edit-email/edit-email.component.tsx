import React from "react";

interface Props {
  onChangeEmail: (newEmail: string) => void;
}

export const EditEmail: React.FC<Props> = (props) => {
  const { onChangeEmail } = props;
  const [newEmail, setNewEmail] = React.useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChangeEmail(newEmail);
  };
  return (
    <div className="container">
      <div className="container-edit-email">
        <h1>Change your Email</h1>
        <form onSubmit={handleSubmit} className="form-edit-email">
          <label htmlFor="email">New Email: </label>
          <input
            type="email"
            name="email"
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button type="submit" className="btn_enviar">
            Change Email
          </button>
        </form>
      </div>
    </div>
  );
};
