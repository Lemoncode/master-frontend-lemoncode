import { useNavigate } from "react-router";

interface Props {
  onLogin: () => void;
}

export const LoginPage = (props: Props) => {
  const { onLogin } = props;
  const navigate = useNavigate();

  const handleLogin = () => {
    onLogin();
    navigate("/characters");
  };
  return (
    <>
      <h2>Pantalla de login</h2>
      <button className="btn btn-primary" onClick={handleLogin}>
        Entrar
      </button>
    </>
  );
};
