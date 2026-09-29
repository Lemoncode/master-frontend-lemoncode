import React from "react";

interface ProbeProps {
  label: string;
}

const RenderProbe = (props: ProbeProps) => {
  const { label } = props;

  const renders = React.useRef(0);
  renders.current += 1;

  return (
    <p>
      {label}: <span className="badge badge-primary">{renders.current}</span>{" "}
      ejecuciones
    </p>
  );
};

const App = () => {
  const [serverStatus, setServerStatus] = React.useState("comprobando...");
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    fetch("/api/health")
      .then((response) => setServerStatus(response.ok ? "ok" : "no responde"))
      .catch(() => setServerStatus("no responde"));
  }, []);

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 p-10">
      <h1 className="text-3xl font-bold">Rick &amp; Morty</h1>

      <p>
        Servidor: <span className="badge badge-soft">{serverStatus}</span>
      </p>

      <div className="card bg-base-200">
        <div className="card-body gap-4">
          <h2 className="card-title">¿Funciona el React Compiler?</h2>
          <p>
            Escribe aquí abajo. Cada tecla vuelve a ejecutar este componente,
            pero el hijo recibe siempre la misma prop.
          </p>

          <input
            className="input w-full"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Escribe lo que quieras..."
          />

          <RenderProbe label="Hijo" />
        </div>
      </div>
    </main>
  );
};

export default App;
