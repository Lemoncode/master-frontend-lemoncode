import type { Episode } from "../character-detail.vm";

interface Props {
  episodes: Episode[];
}

export const EpisodeTable = (props: Props) => {
  const { episodes } = props;

  return (
    <div className="card bg-base-100 border-base-300 border">
      <div className="card-body gap-4">
        <h3 className="card-title text-xl">Primeros episodios</h3>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Emitido</th>
              </tr>
            </thead>

            <tbody>
              {episodes.map((episode) => (
                <tr key={episode.id}>
                  <td className="font-mono">{episode.code}</td>
                  <td>{episode.title}</td>
                  <td className="opacity-60">{episode.airDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
